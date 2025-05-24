import React from "react";
import Player from "./Player";
import { Player as PlayerType } from "../types";

interface SoccerPitchProps {
  homePlayers: PlayerType[];
  awayPlayers: PlayerType[];
  onPlayerDrag: (
    playerId: string,
    newPosition: { x: number; y: number },
  ) => void;
  displayMode: "number" | "initial";
}

const SoccerPitch: React.FC<SoccerPitchProps> = ({
  homePlayers,
  awayPlayers,
  onPlayerDrag,
  displayMode,
}) => {
  return (
    <div className="soccer-pitch">
      <svg width="800" height="600" viewBox="0 0 800 600">
        {/* ピッチの背景 */}
        <rect width="800" height="600" fill="#2e7d32" />

        {/* 外側のライン */}
        <rect
          x="20"
          y="20"
          width="760"
          height="560"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />

        {/* センターライン */}
        <line
          x1="20"
          y1="300"
          x2="780"
          y2="300"
          stroke="white"
          strokeWidth="2"
        />

        {/* センターサークル */}
        <circle
          cx="400"
          cy="300"
          r="80"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* センタースポット */}
        <circle cx="400" cy="300" r="3" fill="white" />

        {/* 上のゴールエリア（相手側） */}
        <rect
          x="320"
          y="20"
          width="160"
          height="60"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 上のペナルティエリア */}
        <rect
          x="250"
          y="20"
          width="300"
          height="150"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 上のペナルティスポット */}
        <circle cx="400" cy="130" r="3" fill="white" />

        {/* 上のゴール */}
        <rect
          x="370"
          y="15"
          width="60"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />

        {/* 下のゴールエリア（自陣側） */}
        <rect
          x="320"
          y="520"
          width="160"
          height="60"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 下のペナルティエリア */}
        <rect
          x="250"
          y="430"
          width="300"
          height="150"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 下のペナルティスポット */}
        <circle cx="400" cy="470" r="3" fill="white" />

        {/* 下のゴール */}
        <rect
          x="370"
          y="575"
          width="60"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />

        {/* ペナルティアーク（上） */}
        <path
          d="M 320 170 A 80 80 0 0 1 480 170"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* ペナルティアーク（下） */}
        <path
          d="M 320 430 A 80 80 0 0 0 480 430"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* コーナーアーク */}
        <path
          d="M 35 20 A 15 15 0 0 0 20 35"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M 765 20 A 15 15 0 0 1 780 35"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M 35 580 A 15 15 0 0 1 20 565"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M 765 580 A 15 15 0 0 0 780 565"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 選手の描画 */}
        {homePlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            displayMode={displayMode}
          />
        ))}

        {awayPlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            displayMode={displayMode}
          />
        ))}
      </svg>
    </div>
  );
};

export default SoccerPitch;
