import { useState } from "react";
import { Player, Team } from "../types";
import { TeamData } from "../components/TeamSelector";
import { PRESET_FORMATIONS } from "../data/formations";

export const useMatchManager = () => {
  const [displayMode, setDisplayMode] = useState<"number" | "initial">(
    "number",
  );
  const [selectedHomeTeamData, setSelectedHomeTeamData] =
    useState<TeamData | null>(null);
  const [selectedAwayTeamData, setSelectedAwayTeamData] =
    useState<TeamData | null>(null);

  // 初期チーム設定
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
        position: { x: pos.x, y: 600 - pos.y }, // Y座標を反転（相手陣営）
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
      players: awayTeam.players.map((p) => ({
        ...p,
        id: p.id.replace("away-", "home-"),
        team: "home",
        position: { x: p.position.x, y: 600 - p.position.y },
      })),
    });
    setAwayTeam({
      ...tempTeam,
      id: "away",
      players: tempTeam.players.map((p) => ({
        ...p,
        id: p.id.replace("home-", "away-"),
        team: "away",
        position: { x: p.position.x, y: 600 - p.position.y },
      })),
    });

    // 選択中チームデータも入れ替え
    const tempSelectedTeam = selectedHomeTeamData;
    setSelectedHomeTeamData(selectedAwayTeamData);
    setSelectedAwayTeamData(tempSelectedTeam);
  };

  return {
    // 状態
    displayMode,
    homeTeam,
    awayTeam,
    selectedHomeTeamData,
    selectedAwayTeamData,

    // アクション
    setDisplayMode,
    setHomeTeam,
    setAwayTeam,
    handleTeamSelect,
    handlePlayersLoaded,
    swapTeams,
  };
};
