// チームデータ取得スクリプト
// Node.jsで実行: npm run fetch-teams

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

async function fetchWithRetry(url, options, retries = API_CONFIG.MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      } else if (response.status === 429) {
        // Rate limit - 設定された時間待機
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

async function fetchTeamData() {
  try {
    console.log("🔍 プレミアリーグのチーム情報を取得中...");

    // APIキーが設定されていない場合はフォールバックデータを作成
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
      createFallbackData();
      return;
    }

    // チーム情報を取得
    const teamsResponse = await fetchWithRetry(
      `${API_CONFIG.API_BASE_URL}/competitions/${API_CONFIG.PREMIER_LEAGUE_ID}/teams`,
      {
        headers: {
          "X-Auth-Token": API_CONFIG.FOOTBALL_DATA_API_KEY,
        },
      },
    );

    const teamsData = await teamsResponse.json();

    if (!teamsData.teams) {
      throw new Error("チームデータが見つかりません");
    }

    console.log(`✅ ${teamsData.teams.length}チームのデータを取得しました`);

    // CSVデータを生成
    const csvHeaders = [
      "id",
      "name",
      "shortName",
      "tla",
      "crest",
      "address",
      "website",
      "founded",
      "clubColors",
      "venue",
    ];

    let csvContent = csvHeaders.join(",") + "\n";

    teamsData.teams.forEach((team) => {
      const row = [
        team.id,
        `"${team.name}"`,
        `"${team.shortName}"`,
        `"${team.tla}"`,
        `"${team.crest || ""}"`,
        `"${team.address || ""}"`,
        `"${team.website || ""}"`,
        team.founded || "",
        `"${team.clubColors || ""}"`,
        `"${team.venue || ""}"`,
      ];
      csvContent += row.join(",") + "\n";
    });

    // public/data ディレクトリを作成
    const dataDir = path.join(__dirname, "..", "public", "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // CSVファイルに保存
    const csvPath = path.join(dataDir, "premier_league_teams.csv");
    fs.writeFileSync(csvPath, csvContent, "utf8");

    console.log(`💾 チームデータを保存しました: ${csvPath}`);
    console.log(`📊 合計 ${teamsData.teams.length} チームのデータ`);

    // 簡易統計表示
    console.log("\n📋 取得したチーム一覧:");
    teamsData.teams.forEach((team, index) => {
      console.log(`${index + 1}. ${team.name} (${team.tla})`);
    });
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);

    // フォールバック: 手動データを作成
    console.log("🔄 フォールバックデータを作成中...");
    createFallbackData();
  }
}

function createFallbackData() {
  // 手動で主要プレミアリーグチームのデータを作成
  const fallbackTeams = [
    {
      id: 57,
      name: "Arsenal FC",
      shortName: "Arsenal",
      tla: "ARS",
      clubColors: "Red / White",
      venue: "Emirates Stadium",
    },
    {
      id: 58,
      name: "Aston Villa FC",
      shortName: "Aston Villa",
      tla: "AVL",
      clubColors: "Claret / Blue",
      venue: "Villa Park",
    },
    {
      id: 61,
      name: "Chelsea FC",
      shortName: "Chelsea",
      tla: "CHE",
      clubColors: "Blue / White",
      venue: "Stamford Bridge",
    },
    {
      id: 62,
      name: "Everton FC",
      shortName: "Everton",
      tla: "EVE",
      clubColors: "Blue / White",
      venue: "Goodison Park",
    },
    {
      id: 64,
      name: "Liverpool FC",
      shortName: "Liverpool",
      tla: "LIV",
      clubColors: "Red / White",
      venue: "Anfield",
    },
    {
      id: 65,
      name: "Manchester City FC",
      shortName: "Man City",
      tla: "MCI",
      clubColors: "Sky Blue / White",
      venue: "Etihad Stadium",
    },
    {
      id: 66,
      name: "Manchester United FC",
      shortName: "Man United",
      tla: "MUN",
      clubColors: "Red / White / Black",
      venue: "Old Trafford",
    },
    {
      id: 73,
      name: "Tottenham Hotspur FC",
      shortName: "Tottenham",
      tla: "TOT",
      clubColors: "Navy Blue / White",
      venue: "Tottenham Hotspur Stadium",
    },
    {
      id: 76,
      name: "Wolverhampton Wanderers FC",
      shortName: "Wolves",
      tla: "WOL",
      clubColors: "Gold / Black",
      venue: "Molineux Stadium",
    },
    {
      id: 328,
      name: "Burnley FC",
      shortName: "Burnley",
      tla: "BUR",
      clubColors: "Claret / Blue",
      venue: "Turf Moor",
    },
    {
      id: 346,
      name: "Watford FC",
      shortName: "Watford",
      tla: "WAT",
      clubColors: "Yellow / Black / Red",
      venue: "Vicarage Road",
    },
    {
      id: 354,
      name: "Crystal Palace FC",
      shortName: "Crystal Palace",
      tla: "CRY",
      clubColors: "Blue / Red",
      venue: "Selhurst Park",
    },
    {
      id: 355,
      name: "Southampton FC",
      shortName: "Southampton",
      tla: "SOU",
      clubColors: "Red / White",
      venue: "St. Mary's Stadium",
    },
    {
      id: 356,
      name: "Sheffield United FC",
      shortName: "Sheffield Utd",
      tla: "SHU",
      clubColors: "Red / White",
      venue: "Bramall Lane",
    },
    {
      id: 397,
      name: "Brighton & Hove Albion FC",
      shortName: "Brighton",
      tla: "BHA",
      clubColors: "Blue / White",
      venue: "Falmer Stadium",
    },
    {
      id: 402,
      name: "Brentford FC",
      shortName: "Brentford",
      tla: "BRE",
      clubColors: "Red / White",
      venue: "Brentford Community Stadium",
    },
    {
      id: 563,
      name: "West Ham United FC",
      shortName: "West Ham",
      tla: "WHU",
      clubColors: "Claret / Blue",
      venue: "London Stadium",
    },
    {
      id: 715,
      name: "Leicester City FC",
      shortName: "Leicester City",
      tla: "LEI",
      clubColors: "Blue / White",
      venue: "King Power Stadium",
    },
    {
      id: 351,
      name: "Nottingham Forest FC",
      shortName: "Nottm Forest",
      tla: "NFO",
      clubColors: "Red / White",
      venue: "The City Ground",
    },
    {
      id: 1044,
      name: "Fulham FC",
      shortName: "Fulham",
      tla: "FUL",
      clubColors: "White / Black",
      venue: "Craven Cottage",
    },
  ];

  const csvHeaders = [
    "id",
    "name",
    "shortName",
    "tla",
    "crest",
    "address",
    "website",
    "founded",
    "clubColors",
    "venue",
  ];

  let csvContent = csvHeaders.join(",") + "\n";

  fallbackTeams.forEach((team) => {
    const row = [
      team.id,
      `"${team.name}"`,
      `"${team.shortName}"`,
      `"${team.tla}"`,
      '""', // crest
      '""', // address
      '""', // website
      "", // founded
      `"${team.clubColors}"`,
      `"${team.venue}"`,
    ];
    csvContent += row.join(",") + "\n";
  });

  const dataDir = path.join(__dirname, "..", "public", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const csvPath = path.join(dataDir, "premier_league_teams.csv");
  fs.writeFileSync(csvPath, csvContent, "utf8");

  console.log(`💾 フォールバックデータを保存しました: ${csvPath}`);
  console.log(`📊 合計 ${fallbackTeams.length} チームのデータ`);
}

// 実行
fetchTeamData();
