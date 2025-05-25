import { useState } from "react";
import { Player, Team } from "../types";
import { TeamData } from "../components/TeamSelector";
import { PRESET_FORMATIONS } from "../data/formations";

export const useMatchManager = () => {
  const [selectedHomeTeamData, setSelectedHomeTeamData] =
    useState<TeamData | null>(null);
  const [selectedAwayTeamData, setSelectedAwayTeamData] =
    useState<TeamData | null>(null);

  // 初期チーム設定（縦長ピッチ 800x800 対応）
  const [homeTeam, setHomeTeam] = useState<Team>(() => {
    const defaultFormation = PRESET_FORMATIONS[0];
    return {
      id: "home",
      name: "ホームチーム",
      players: defaultFormation.positions.map((pos, index) => ({
        id: `home-${index}`,
        name: `選手${index + 1}`,
        number: index + 1,
        position: { ...pos },
        playerPosition:
          index === 0 ? "GK" : index < 5 ? "DF" : index < 8 ? "MF" : "FW",
        team: "home",
      })),
      formations: {
        default: {
          basic: defaultFormation,
          attack: defaultFormation,
          defense: defaultFormation,
        },
      },
      currentFormation: "default",
      currentPhase: "basic",
    };
  });

  const [awayTeam, setAwayTeam] = useState<Team>(() => {
    const defaultFormation = PRESET_FORMATIONS[0];
    return {
      id: "away",
      name: "アウェイチーム",
      players: defaultFormation.positions.map((pos, index) => ({
        id: `away-${index}`,
        name: `選手${index + 1}`,
        number: index + 1,
        // アウェイチームは上のゴールに向かって配置（Y座標をミラー反転）
        position: { x: pos.x, y: 800 - pos.y },
        playerPosition:
          index === 0 ? "GK" : index < 5 ? "DF" : index < 8 ? "MF" : "FW",
        team: "away",
      })),
      formations: {
        default: {
          basic: defaultFormation,
          attack: defaultFormation,
          defense: defaultFormation,
        },
      },
      currentFormation: "default",
      currentPhase: "basic",
    };
  });

  // チーム選択処理
  const handleTeamSelect = (
    team: "home" | "away",
    teamData: TeamData | null,
  ) => {
    if (team === "home") {
      setSelectedHomeTeamData(teamData);
      if (teamData) {
        setHomeTeam((prev) => ({ ...prev, name: teamData.shortName }));
      }
    } else {
      setSelectedAwayTeamData(teamData);
      if (teamData) {
        setAwayTeam((prev) => ({ ...prev, name: teamData.shortName }));
      }
    }
  };

  // 選手データロード処理
  const handlePlayersLoaded = (team: "home" | "away", players: Player[]) => {
    if (team === "home") {
      setHomeTeam((prev) => ({ ...prev, players }));
    } else {
      setAwayTeam((prev) => ({ ...prev, players }));
    }
  };

  // チーム入れ替え
  const swapTeams = () => {
    const tempTeam = { ...homeTeam };
    setHomeTeam({
      ...awayTeam,
      id: "home",
      players: awayTeam.players.map((p) => {
        // アウェイからホームに変わる時：800 - Y座標で反転
        const newY = 800 - p.position.y;
        const boundedY = Math.max(420, Math.min(775, newY));

        return {
          ...p,
          id: p.id.replace("away-", "home-"),
          team: "home",
          position: { x: p.position.x, y: boundedY },
        };
      }),
    });
    setAwayTeam({
      ...tempTeam,
      id: "away",
      players: tempTeam.players.map((p) => {
        // ホームからアウェイに変わる時：800 - Y座標で反転
        const newY = 800 - p.position.y;
        const boundedY = Math.max(25, Math.min(380, newY));

        return {
          ...p,
          id: p.id.replace("home-", "away-"),
          team: "away",
          position: { x: p.position.x, y: boundedY },
        };
      }),
    });

    // 選択中チームデータも入れ替え
    const tempSelectedTeam = selectedHomeTeamData;
    setSelectedHomeTeamData(selectedAwayTeamData);
    setSelectedAwayTeamData(tempSelectedTeam);
  };

  return {
    // 状態
    homeTeam,
    awayTeam,
    selectedHomeTeamData,
    selectedAwayTeamData,

    // アクション
    setHomeTeam,
    setAwayTeam,
    handleTeamSelect,
    handlePlayersLoaded,
    swapTeams,
  };
};
