import { useState } from "react";
import { Formation, Team } from "../types";
import { PRESET_FORMATIONS } from "../data/formations";

export const useFormationManager = () => {
  const [customFormations, setCustomFormations] = useState<Formation[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalTeam, setModalTeam] = useState<"home" | "away">("home");
  const [homeSelectedFormation, setHomeSelectedFormation] = useState(
    PRESET_FORMATIONS[0].id,
  );
  const [awaySelectedFormation, setAwaySelectedFormation] = useState(
    PRESET_FORMATIONS[0].id,
  );

  // 全フォーメーションリスト（プリセット + カスタム）
  const allFormations = [...PRESET_FORMATIONS, ...customFormations];

  // フォーメーション変更処理
  const handleFormationChange = (
    team: "home" | "away",
    formationId: string,
    _homeTeam: Team,
    _awayTeam: Team,
    setHomeTeam: (team: Team | ((prev: Team) => Team)) => void,
    setAwayTeam: (team: Team | ((prev: Team) => Team)) => void,
  ) => {
    const formation = allFormations.find((f) => f.id === formationId);
    if (!formation) return;

    if (team === "home") {
      setHomeSelectedFormation(formationId);
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player, index) => ({
          ...player,
          position: formation.positions[index]
            ? { ...formation.positions[index] }
            : player.position,
        })),
      }));
    } else {
      setAwaySelectedFormation(formationId);
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player, index) => ({
          ...player,
          position: formation.positions[index]
            ? {
                x: formation.positions[index].x,
                y: 800 - formation.positions[index].y,
              }
            : player.position,
        })),
      }));
    }
  };

  // カスタムフォーメーション作成
  const handleCreateCustomFormation = (team: "home" | "away") => {
    setModalTeam(team);
    setShowCustomModal(true);
  };

  const handleSaveCustomFormation = (formation: Formation) => {
    setCustomFormations((prev) => [...prev, formation]);
  };

  const handleDeleteCustomFormation = (formationId: string) => {
    setCustomFormations((prev) => prev.filter((f) => f.id !== formationId));

    // 削除されたフォーメーションが選択されていた場合はデフォルトに戻す
    if (homeSelectedFormation === formationId) {
      setHomeSelectedFormation(PRESET_FORMATIONS[0].id);
    }
    if (awaySelectedFormation === formationId) {
      setAwaySelectedFormation(PRESET_FORMATIONS[0].id);
    }
  };

  // 戦術フェーズ変更
  const handlePhaseChange = (
    team: "home" | "away",
    phase: "basic" | "attack" | "defense",
    setHomeTeam: (team: Team | ((prev: Team) => Team)) => void,
    setAwayTeam: (team: Team | ((prev: Team) => Team)) => void,
  ) => {
    if (team === "home") {
      setHomeTeam((prev) => ({ ...prev, currentPhase: phase }));
    } else {
      setAwayTeam((prev) => ({ ...prev, currentPhase: phase }));
    }
  };

  // 現在の選手配置を取得
  const getCurrentPositions = (
    team: "home" | "away",
    homeTeam: Team,
    awayTeam: Team,
  ) => {
    return team === "home"
      ? homeTeam.players.map((p) => p.position)
      : awayTeam.players.map((p) => ({
          x: p.position.x,
          y: 600 - p.position.y,
        })); // アウェイは反転して保存
  };

  return {
    // 状態
    customFormations,
    showCustomModal,
    modalTeam,
    homeSelectedFormation,
    awaySelectedFormation,
    allFormations,

    // アクション
    setCustomFormations,
    setShowCustomModal,
    setHomeSelectedFormation,
    setAwaySelectedFormation,
    handleFormationChange,
    handleCreateCustomFormation,
    handleSaveCustomFormation,
    handleDeleteCustomFormation,
    handlePhaseChange,
    getCurrentPositions,
  };
};
