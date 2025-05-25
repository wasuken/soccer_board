import { useState } from "react";
import { Player, Team } from "../types";

export const usePlayerManager = () => {
  const [highlightedPlayer, setHighlightedPlayer] = useState<
    string | undefined
  >();

  // 選手のドラッグ処理
  const handlePlayerDrag = (
    playerId: string,
    newPosition: { x: number; y: number },
    setHomeTeam: (team: Team | ((prev: Team) => Team)) => void,
    setAwayTeam: (team: Team | ((prev: Team) => Team)) => void,
  ) => {
    if (playerId.startsWith("home-")) {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId
            ? { ...player, position: newPosition }
            : player,
        ),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId
            ? { ...player, position: newPosition }
            : player,
        ),
      }));
    }
  };

  // 選手データ更新
  const handlePlayerUpdate = (
    playerId: string,
    updates: Partial<Player>,
    setHomeTeam: (team: Team | ((prev: Team) => Team)) => void,
    setAwayTeam: (team: Team | ((prev: Team) => Team)) => void,
  ) => {
    if (playerId.startsWith("home-")) {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId ? { ...player, ...updates } : player,
        ),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId ? { ...player, ...updates } : player,
        ),
      }));
    }
  };

  // 選手ハイライト表示
  const handlePlayerFocus = (playerId: string) => {
    setHighlightedPlayer(playerId);
    // 3秒後にハイライト解除
    setTimeout(() => {
      setHighlightedPlayer(undefined);
    }, 3000);
  };

  // 自動背番号設定
  const handleAutoNumbering = (
    team: "home" | "away",
    updates: Array<{ id: string; number: number }>,
    setHomeTeam: (team: Team | ((prev: Team) => Team)) => void,
    setAwayTeam: (team: Team | ((prev: Team) => Team)) => void,
  ) => {
    if (team === "home") {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          const update = updates.find((u) => u.id === player.id);
          return update ? { ...player, number: update.number } : player;
        }),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          const update = updates.find((u) => u.id === player.id);
          return update ? { ...player, number: update.number } : player;
        }),
      }));
    }
  };

  return {
    // 状態
    highlightedPlayer,

    // アクション
    setHighlightedPlayer,
    handlePlayerDrag,
    handlePlayerUpdate,
    handlePlayerFocus,
    handleAutoNumbering,
  };
};
