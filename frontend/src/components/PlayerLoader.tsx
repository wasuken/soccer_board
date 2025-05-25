import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Player, PlayerPosition } from "../types";
import { TeamData } from "./TeamSelector";

export interface PlayerData {
  id: string;
  name: string;
  position: PlayerPosition;
  shirtNumber: number;
  dateOfBirth: string;
  nationality: string;
  teamId: string;
  teamName: string;
}

interface PlayerLoaderProps {
  selectedTeam: TeamData | null;
  onPlayersLoaded: (players: Player[]) => void;
  team: "home" | "away";
}

const PlayerLoader: React.FC<PlayerLoaderProps> = ({
  selectedTeam,
  onPlayersLoaded,
  team,
}) => {
  const [allPlayers, setAllPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayerData();
  }, []);

  useEffect(() => {
    if (selectedTeam && allPlayers.length > 0) {
      loadTeamPlayers();
    }
  }, [selectedTeam, allPlayers]);

  const loadPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/data/premier_league_players.csv");

      if (!response.ok) {
        throw new Error(
          `選手データファイルの読み込みに失敗しました: ${response.status}`,
        );
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn("選手CSV解析警告:", results.errors);
          }

          const playerData = results.data as PlayerData[];

          // データの検証とクリーニング
          const validPlayers = playerData
            .filter((player) => player.name && player.position && player.teamId)
            .map((player) => ({
              ...player,
              id: String(player.id),
              name: player.name.trim(),
              position: player.position as PlayerPosition,
              shirtNumber: Number(player.shirtNumber) || 1,
              teamId: String(player.teamId),
            }));

          setAllPlayers(validPlayers);
          console.log(
            `✅ ${validPlayers.length}名の選手データを読み込みました`,
          );
        },
        error: (error) => {
          throw new Error(`選手CSV解析エラー: ${error.message}`);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "不明なエラー";
      setError(errorMessage);
      console.error("選手データ読み込みエラー:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamPlayers = () => {
    if (!selectedTeam) return;

    // 選択されたチームの選手をフィルター
    const teamPlayers = allPlayers.filter(
      (player) => player.teamId === selectedTeam.id,
    );

    if (teamPlayers.length === 0) {
      console.warn(`${selectedTeam.shortName}の選手データが見つかりません`);
      return;
    }

    // ポジション順でソートして11名を選択
    const sortedPlayers = teamPlayers.sort((a, b) => {
      const posOrder = { GK: 1, DF: 2, MF: 3, FW: 4 };
      const orderA = posOrder[a.position];
      const orderB = posOrder[b.position];
      if (orderA !== orderB) return orderA - orderB;
      return a.shirtNumber - b.shirtNumber;
    });

    // 11名を選択（GK1名、他のポジションから残りを選択）
    const selectedPlayers: PlayerData[] = [];
    const gk = sortedPlayers.find((p) => p.position === "GK");
    if (gk) selectedPlayers.push(gk);

    // 残りのポジションから10名選択
    const otherPlayers = sortedPlayers.filter((p) => p.position !== "GK");
    selectedPlayers.push(...otherPlayers.slice(0, 10));

    // 11名に足りない場合は足りない分を補完
    while (selectedPlayers.length < 11) {
      const missingIndex = selectedPlayers.length;
      selectedPlayers.push({
        id: `${selectedTeam.id}-missing-${missingIndex}`,
        name: `選手${missingIndex + 1}`,
        position:
          missingIndex === 0
            ? "GK"
            : missingIndex < 5
              ? "DF"
              : missingIndex < 8
                ? "MF"
                : "FW",
        shirtNumber: missingIndex + 1,
        dateOfBirth: "",
        nationality: "",
        teamId: selectedTeam.id,
        teamName: selectedTeam.shortName,
      });
    }

    // Playerオブジェクトに変換
    const players: Player[] = selectedPlayers.map((playerData, index) => ({
      id: `${team}-${index}`,
      name: playerData.name,
      number: playerData.shirtNumber,
      position: {
        x: 400,
        y: team === "home" ? 500 - index * 40 : 100 + index * 40,
      }, // 仮の配置
      playerPosition: playerData.position,
      team: team,
    }));

    onPlayersLoaded(players);
    console.log(
      `✅ ${selectedTeam.shortName}の選手${players.length}名をロードしました`,
    );
  };

  if (!selectedTeam) {
    return null;
  }

  if (loading) {
    return (
      <div className="alert alert-info">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
          選手データを読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <strong>⚠️ 選手データ読み込みエラー</strong>
        <br />
        {error}
        <div className="mt-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={loadPlayerData}
          >
            🔄 再読み込み
          </button>
        </div>
        <div className="mt-2">
          <small className="text-muted">
            💡 選手データが存在しない場合は、<code>npm run fetch-players</code>{" "}
            を実行してください
          </small>
        </div>
      </div>
    );
  }

  const teamPlayerCount = allPlayers.filter(
    (p) => p.teamId === selectedTeam.id,
  ).length;

  return (
    <div className="alert alert-success">
      <strong>✅ 選手データ読み込み完了</strong>
      <br />
      {selectedTeam.shortName}: {teamPlayerCount}名の選手が利用可能
      {teamPlayerCount < 11 && (
        <div className="mt-1">
          <small className="text-warning">
            ⚠️ 11名未満のため、不足分は自動生成されます
          </small>
        </div>
      )}
    </div>
  );
};

export default PlayerLoader;
