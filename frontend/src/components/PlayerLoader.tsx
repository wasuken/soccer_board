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
  priority: number;
  role: string;
  originalPosition: string;
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
  }, [selectedTeam?.id, allPlayers.length]); // selectedTeam全体ではなくidのみを監視

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

          const validPlayers = playerData
            .filter((player) => player.name && player.position && player.teamId)
            .map((player) => ({
              ...player,
              id: String(player.id),
              name: player.name.trim(),
              position: player.position as PlayerPosition,
              shirtNumber: Number(player.shirtNumber) || 1,
              teamId: String(player.teamId),
              priority: Number(player.priority) || 1000,
            }));

          setAllPlayers(validPlayers);
          console.log(
            `✅ ${validPlayers.length}名の選手データを読み込みました`,
          );
        },
        error: (error: Error) => {
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

    const teamPlayers = allPlayers.filter(
      (player) => player.teamId === selectedTeam.id,
    );

    if (teamPlayers.length === 0) {
      console.warn(`${selectedTeam.shortName}の選手データが見つかりません`);
      return;
    }

    const playersByPosition = {
      GK: teamPlayers
        .filter((p) => p.position === "GK")
        .sort((a, b) => a.priority - b.priority),
      DF: teamPlayers
        .filter((p) => p.position === "DF")
        .sort((a, b) => a.priority - b.priority),
      MF: teamPlayers
        .filter((p) => p.position === "MF")
        .sort((a, b) => a.priority - b.priority),
      FW: teamPlayers
        .filter((p) => p.position === "FW")
        .sort((a, b) => a.priority - b.priority),
    };

    const idealFormation = {
      GK: 1,
      DF: 4,
      MF: 3,
      FW: 3,
    };

    const selectedPlayers: PlayerData[] = [];

    Object.entries(idealFormation).forEach(([position, count]) => {
      const availablePlayers = playersByPosition[position as PlayerPosition];
      const selectedFromPosition = availablePlayers.slice(0, count);
      selectedPlayers.push(...selectedFromPosition);
    });

    while (selectedPlayers.length < 11) {
      const remainingPlayers = teamPlayers
        .filter((p) => !selectedPlayers.some((sp) => sp.id === p.id))
        .sort((a, b) => a.priority - b.priority);

      if (remainingPlayers.length === 0) break;
      selectedPlayers.push(remainingPlayers[0]);
    }

    while (selectedPlayers.length < 11) {
      const missingIndex = selectedPlayers.length;
      const position =
        missingIndex === 0
          ? "GK"
          : missingIndex < 5
            ? "DF"
            : missingIndex < 8
              ? "MF"
              : "FW";

      selectedPlayers.push({
        id: `${selectedTeam.id}-missing-${missingIndex}`,
        name: `選手${missingIndex + 1}`,
        position: position,
        shirtNumber: missingIndex + 1,
        dateOfBirth: "",
        nationality: "",
        teamId: selectedTeam.id,
        teamName: selectedTeam.shortName,
        priority: 1000,
        role: "",
        originalPosition: position,
      });
    }

    const finalPlayers = selectedPlayers.slice(0, 11);

    const players: Player[] = finalPlayers.map((playerData, index) => ({
      id: `${team}-${index}`,
      name: playerData.name,
      number: playerData.shirtNumber,
      position: {
        x: 400,
        y: team === "home" ? 500 - index * 40 : 100 + index * 40,
      },
      playerPosition: playerData.position,
      team: team,
    }));

    onPlayersLoaded(players);

    console.log(`✅ ${selectedTeam.shortName}の選手構成:`);
    const positionCounts = { GK: 0, DF: 0, MF: 0, FW: 0 };
    finalPlayers.forEach((p) => {
      positionCounts[p.position]++;
      console.log(
        `${p.position} ${p.shirtNumber} ${p.name} (優先度: ${p.priority})`,
      );
    });
    console.log(
      `構成: GK${positionCounts.GK} DF${positionCounts.DF} MF${positionCounts.MF} FW${positionCounts.FW}`,
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
  const positionBreakdown = allPlayers
    .filter((p) => p.teamId === selectedTeam.id)
    .reduce(
      (acc, p) => {
        acc[p.position] = (acc[p.position] || 0) + 1;
        return acc;
      },
      {} as Record<PlayerPosition, number>,
    );

  return (
    <div className="alert alert-success">
      <strong>✅ 選手データ読み込み完了</strong>
      <br />
      {selectedTeam.shortName}: {teamPlayerCount}名の選手が利用可能
      <div className="mt-2">
        <small className="text-info">
          📊 構成: GK{positionBreakdown.GK || 0} DF{positionBreakdown.DF || 0}{" "}
          MF{positionBreakdown.MF || 0} FW{positionBreakdown.FW || 0}
        </small>
      </div>
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
