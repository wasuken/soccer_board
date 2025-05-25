import React from "react";
import { Player, PlayerPosition } from "../types";

interface AutoNumberingProps {
  players: Player[];
  team: "home" | "away";
  onApplyNumbering: (updates: Array<{ id: string; number: number }>) => void;
}

const AutoNumbering: React.FC<AutoNumberingProps> = ({
  players,
  team,
  onApplyNumbering,
}) => {
  const applyTraditionalNumbering = () => {
    const sortedPlayers = [...players].sort((a, b) => {
      // ポジション順でソート
      const posOrder: Record<PlayerPosition, number> = {
        GK: 1,
        DF: 2,
        MF: 3,
        FW: 4,
      };
      const orderA = posOrder[a.playerPosition];
      const orderB = posOrder[b.playerPosition];

      if (orderA !== orderB) return orderA - orderB;

      // 同じポジション内では現在の背番号順
      return a.number - b.number;
    });

    const updates = sortedPlayers.map((player, index) => ({
      id: player.id,
      number: index + 1,
    }));

    onApplyNumbering(updates);
  };

  const applyPositionBasedNumbering = () => {
    const updates: Array<{ id: string; number: number }> = [];
    let currentNumber = 1;

    // GK: 1番
    const gkPlayers = players.filter((p) => p.playerPosition === "GK");
    gkPlayers.forEach((player) => {
      updates.push({ id: player.id, number: currentNumber++ });
    });

    // DF: 2-5番
    const dfPlayers = players.filter((p) => p.playerPosition === "DF");
    dfPlayers.forEach((player) => {
      updates.push({ id: player.id, number: currentNumber++ });
    });

    // MF: 6-8番
    const mfPlayers = players.filter((p) => p.playerPosition === "MF");
    mfPlayers.forEach((player) => {
      updates.push({ id: player.id, number: currentNumber++ });
    });

    // FW: 9-11番
    const fwPlayers = players.filter((p) => p.playerPosition === "FW");
    fwPlayers.forEach((player) => {
      updates.push({ id: player.id, number: currentNumber++ });
    });

    onApplyNumbering(updates);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6
          className={`mb-0 ${team === "home" ? "text-primary" : "text-danger"}`}
        >
          🔢 自動背番号設定
        </h6>
      </div>

      <div className="card-body">
        <div className="d-grid gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={applyTraditionalNumbering}
          >
            📋 順番に1-11番を割り当て
          </button>

          <button
            className="btn btn-outline-info btn-sm"
            onClick={applyPositionBasedNumbering}
          >
            ⚽ 伝統的配番（GK:1, DF:2-5, MF:6-8, FW:9-11）
          </button>
        </div>

        <div className="mt-3">
          <small className="text-muted">
            💡 ポジション順で自動的に背番号を設定します
          </small>
        </div>
      </div>
    </div>
  );
};

export default AutoNumbering;
