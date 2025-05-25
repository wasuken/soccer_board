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
  highlightedPlayer?: string;
}

const SoccerPitch: React.FC<SoccerPitchProps> = ({
  homePlayers,
  awayPlayers,
  onPlayerDrag,
  displayMode,
  highlightedPlayer,
}) => {
  return (
    <div className="soccer-pitch">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          maxHeight: "70vh",
          minHeight: "400px",
          display: "block",
        }}
      >
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

        {/* ゴールサイド表示 */}
        <g>
          {/* 上側（アウェイ陣地） */}
          <rect
            x="350"
            y="40"
            width="100"
            height="25"
            fill="rgba(220, 53, 69, 0.8)"
            rx="12"
          />
          <text
            x="400"
            y="57"
            className="goal-label"
            fill="white"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
          >
            AWAY GOAL
          </text>

          {/* 下側（ホーム陣地） */}
          <rect
            x="350"
            y="535"
            width="100"
            height="25"
            fill="rgba(0, 123, 255, 0.8)"
            rx="12"
          />
          <text
            x="400"
            y="552"
            className="goal-label"
            fill="white"
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
          >
            HOME GOAL
          </text>
        </g>

        {/* サイドライン方向矢印 */}
        <g>
          {/* 左サイド - ホームからアウェイ方向 */}
          <path
            d="M 10 520 L 10 80"
            stroke="rgba(0, 123, 255, 0.6)"
            strokeWidth="4"
            markerEnd="url(#arrowhead-blue)"
          />

          {/* 右サイド - アウェイからホーム方向 */}
          <path
            d="M 790 80 L 790 520"
            stroke="rgba(220, 53, 69, 0.6)"
            strokeWidth="4"
            markerEnd="url(#arrowhead-red)"
          />
        </g>

        {/* 矢印マーカー定義 */}
        <defs>
          <marker
            id="arrowhead-blue"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 123, 255, 0.8)" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(220, 53, 69, 0.8)" />
          </marker>
        </defs>

        {/* 選手の描画 */}
        {homePlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            displayMode={displayMode}
            isHighlighted={highlightedPlayer === player.id}
          />
        ))}

        {awayPlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            displayMode={displayMode}
            isHighlighted={highlightedPlayer === player.id}
          />
        ))}
      </svg>
    </div>
  );
};

export default SoccerPitch;
