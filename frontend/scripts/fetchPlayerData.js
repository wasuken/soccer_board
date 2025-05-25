// 選手データ取得スクリプト
// Node.jsで実行: npm run fetch-players

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Moduleで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API設定を読み込み
let API_CONFIG;
try {
  const configModule = await import("../config.js");
  API_CONFIG = configModule.API_CONFIG;
} catch (error) {
  console.log(
    "⚠️ config.jsが見つかりません。環境変数またはフォールバックデータを使用します。",
  );
  API_CONFIG = {
    FOOTBALL_DATA_API_KEY:
      process.env.FOOTBALL_DATA_API_KEY || "YOUR_API_KEY_HERE",
    API_BASE_URL: "https://api.football-data.org/v4",
    PREMIER_LEAGUE_ID: 2021,
    REQUEST_DELAY: 1000,
    MAX_RETRIES: 3,
    RATE_LIMIT_DELAY: 60000,
  };
}

// 選手のポジションマッピング
const POSITION_MAPPING = {
  Goalkeeper: "GK",
  "Centre-Back": "DF",
  "Left-Back": "DF",
  "Right-Back": "DF",
  "Defensive Midfield": "MF",
  "Central Midfield": "MF",
  "Left Midfield": "MF",
  "Right Midfield": "MF",
  "Attacking Midfield": "MF",
  "Left Winger": "FW",
  "Right Winger": "FW",
  "Centre-Forward": "FW",
};

// ポジション別の優先度設定（背番号ベース）
const POSITION_PRIORITY = {
  GK: [1, 12, 13, 21, 22, 23, 30, 31, 32, 33],
  DF: [2, 3, 4, 5, 6, 14, 15, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28, 29],
  MF: [6, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  FW: [7, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
};

async function fetchWithRetry(url, options, retries = API_CONFIG.MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      } else if (response.status === 429) {
        console.log(
          `Rate limit hit, waiting ${API_CONFIG.RATE_LIMIT_DELAY / 1000} seconds...`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.RATE_LIMIT_DELAY),
        );
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function loadTeamIds() {
  try {
    const csvPath = path.join(
      __dirname,
      "..",
      "public",
      "data",
      "premier_league_teams.csv",
    );
    if (!fs.existsSync(csvPath)) {
      throw new Error(
        "チームデータファイルが見つかりません。先にnpm run fetch-teamsを実行してください。",
      );
    }

    const csvContent = fs.readFileSync(csvPath, "utf8");
    const lines = csvContent.split("\n").filter((line) => line.trim());
    const teams = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(",");
      if (columns.length >= 3) {
        teams.push({
          id: columns[0].trim(),
          name: columns[1].replace(/"/g, "").trim(),
          shortName: columns[2].replace(/"/g, "").trim(),
        });
      }
    }

    return teams;
  } catch (error) {
    console.error("チームデータの読み込みエラー:", error.message);
    return [];
  }
}

function calculatePlayerPriority(player, position) {
  let priority = 1000; // デフォルト優先度（低い）

  // 背番号による優先度
  if (player.shirtNumber && POSITION_PRIORITY[position]) {
    const positionIndex = POSITION_PRIORITY[position].indexOf(
      player.shirtNumber,
    );
    if (positionIndex !== -1) {
      priority = positionIndex; // 0が最高優先度
    }
  }

  // APIのroleがあれば考慮
  if (player.role === "CAPTAIN") {
    priority -= 50; // キャプテンは優先度アップ
  }

  // 年齢による調整（25-30歳が主力と仮定）
  if (player.dateOfBirth) {
    const age =
      new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear();
    if (age >= 25 && age <= 30) {
      priority -= 10; // 主力年齢は優先度アップ
    } else if (age > 35) {
      priority += 20; // 高齢は優先度ダウン
    }
  }

  return priority;
}

async function fetchPlayersForTeam(teamId, teamName) {
  try {
    console.log(`🔍 ${teamName} の選手情報を取得中...`);

    const response = await fetchWithRetry(
      `${API_CONFIG.API_BASE_URL}/teams/${teamId}`,
      {
        headers: {
          "X-Auth-Token": API_CONFIG.FOOTBALL_DATA_API_KEY,
        },
      },
    );

    const teamData = await response.json();

    if (!teamData.squad || teamData.squad.length === 0) {
      console.warn(`⚠️ ${teamName} の選手データが見つかりません`);
      return createFallbackPlayersForTeam(teamId, teamName);
    }

    // 選手データを処理して優先度を追加
    const players = teamData.squad.map((player) => {
      const position = POSITION_MAPPING[player.position] || "MF";
      const priority = calculatePlayerPriority(player, position);

      return {
        id: player.id,
        name: player.name,
        position: position,
        shirtNumber: player.shirtNumber || null,
        dateOfBirth: player.dateOfBirth || "",
        nationality: player.nationality || "",
        teamId: teamId,
        teamName: teamName,
        priority: priority,
        role: player.role || "",
        originalPosition: player.position || "",
      };
    });

    console.log(`✅ ${teamName}: ${players.length}名の選手データを取得`);
    return players;
  } catch (error) {
    console.error(`❌ ${teamName} の選手データ取得エラー:`, error.message);
    return createFallbackPlayersForTeam(teamId, teamName);
  }
}

function createFallbackPlayersForTeam(teamId, teamName) {
  const positions = [
    "GK",
    "DF",
    "DF",
    "DF",
    "DF",
    "MF",
    "MF",
    "MF",
    "FW",
    "FW",
    "FW",
  ];
  const players = [];

  for (let i = 0; i < 11; i++) {
    players.push({
      id: `${teamId}-${i + 1}`,
      name: `選手${i + 1}`,
      position: positions[i],
      shirtNumber: i + 1,
      dateOfBirth: "",
      nationality: "",
      teamId: teamId,
      teamName: teamName,
      priority: i, // 順番通りの優先度
      role: "",
      originalPosition: positions[i],
    });
  }

  console.log(`🔄 ${teamName}: フォールバック選手データを作成`);
  return players;
}

async function fetchPlayerData() {
  try {
    console.log("🔍 プレミアリーグの選手情報を取得開始...");

    // APIキーチェック
    if (
      API_CONFIG.FOOTBALL_DATA_API_KEY === "YOUR_API_KEY_HERE" ||
      !API_CONFIG.FOOTBALL_DATA_API_KEY
    ) {
      console.log(
        "⚠️ APIキーが設定されていません。フォールバックデータを作成します。",
      );
      console.log("💡 APIキーを設定する方法:");
      console.log("   1. config.example.js を config.js にコピー");
      console.log("   2. config.js でAPIキーを設定");
      console.log("   3. または環境変数 FOOTBALL_DATA_API_KEY を設定");
      await createFullFallbackData();
      return;
    }

    // チーム情報を読み込み
    const teams = await loadTeamIds();
    if (teams.length === 0) {
      throw new Error("チームデータを読み込めませんでした");
    }

    console.log(`📋 ${teams.length}チームの選手データを取得します`);

    const allPlayers = [];

    // 各チームの選手データを取得
    for (const team of teams) {
      const players = await fetchPlayersForTeam(team.id, team.shortName);
      allPlayers.push(...players);

      // API制限対策
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.REQUEST_DELAY),
      );
    }

    console.log(`✅ 総計 ${allPlayers.length}名の選手データを取得しました`);

    // CSVデータを生成
    const csvHeaders = [
      "id",
      "name",
      "position",
      "shirtNumber",
      "dateOfBirth",
      "nationality",
      "teamId",
      "teamName",
      "priority",
      "role",
      "originalPosition",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    allPlayers.forEach((player) => {
      const row = [
        player.id,
        `"${player.name}"`,
        player.position,
        player.shirtNumber || "",
        `"${player.dateOfBirth}"`,
        `"${player.nationality}"`,
        player.teamId,
        `"${player.teamName}"`,
        player.priority,
        `"${player.role}"`,
        `"${player.originalPosition}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // CSVファイルに保存
    const dataDir = path.join(__dirname, "..", "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const csvPath = path.join(dataDir, "premier_league_players.csv");
    fs.writeFileSync(csvPath, csvContent, "utf8");

    console.log(`💾 選手データを保存しました: ${csvPath}`);

    // 統計表示
    const teamStats = {};
    const positionStats = { GK: 0, DF: 0, MF: 0, FW: 0 };

    allPlayers.forEach((player) => {
      teamStats[player.teamName] = (teamStats[player.teamName] || 0) + 1;
      positionStats[player.position] =
        (positionStats[player.position] || 0) + 1;
    });

    console.log("\n📊 チーム別選手数:");
    Object.entries(teamStats).forEach(([team, count]) => {
      console.log(`${team}: ${count}名`);
    });

    console.log("\n📊 ポジション別選手数:");
    Object.entries(positionStats).forEach(([position, count]) => {
      console.log(`${position}: ${count}名`);
    });
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    console.log("🔄 フォールバックデータを作成中...");
    await createFullFallbackData();
  }
}

async function createFullFallbackData() {
  const teams = await loadTeamIds();
  if (teams.length === 0) {
    console.error("❌ チームデータが見つかりません");
    return;
  }

  const allPlayers = [];

  teams.forEach((team) => {
    const players = createFallbackPlayersForTeam(team.id, team.shortName);
    allPlayers.push(...players);
  });

  // CSVデータを生成
  const csvHeaders = [
    "id",
    "name",
    "position",
    "shirtNumber",
    "dateOfBirth",
    "nationality",
    "teamId",
    "teamName",
    "priority",
    "role",
    "originalPosition",
  ];

  let csvContent = csvHeaders.join(",") + "\n";

  allPlayers.forEach((player) => {
    const row = [
      player.id,
      `"${player.name}"`,
      player.position,
      player.shirtNumber || "",
      `"${player.dateOfBirth}"`,
      `"${player.nationality}"`,
      player.teamId,
      `"${player.teamName}"`,
      player.priority,
      `"${player.role}"`,
      `"${player.originalPosition}"`,
    ];
    csvContent += row.join(",") + "\n";
  });

  const dataDir = path.join(__dirname, "..", "public", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const csvPath = path.join(dataDir, "premier_league_players.csv");
  fs.writeFileSync(csvPath, csvContent, "utf8");

  console.log(`💾 フォールバック選手データを保存しました: ${csvPath}`);
  console.log(`📊 合計 ${allPlayers.length}名の選手データ`);
}

// 実行
fetchPlayerData();
