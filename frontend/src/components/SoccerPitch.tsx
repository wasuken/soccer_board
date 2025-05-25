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
  highlightedPlayer?: string;
}

const SoccerPitch: React.FC<SoccerPitchProps> = ({
  homePlayers,
  awayPlayers,
  onPlayerDrag,
  highlightedPlayer,
}) => {
  return (
    <div className="soccer-pitch">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid meet"
        style={{
          maxHeight: "80vh",
          minHeight: "500px",
          display: "block",
        }}
      >
        {/* ピッチの背景 */}
        <rect width="800" height="800" fill="#2e7d32" />

        {/* 外側のライン */}
        <rect
          x="20"
          y="20"
          width="760"
          height="760"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />

        {/* センターライン */}
        <line
          x1="20"
          y1="400"
          x2="780"
          y2="400"
          stroke="white"
          strokeWidth="3"
        />

        {/* センターサークル */}
        <circle
          cx="400"
          cy="400"
          r="80"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* センタースポット */}
        <circle cx="400" cy="400" r="3" fill="white" />

        {/* 上のゴールエリア（アウェイ側） */}
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

        {/* 下のゴールエリア（ホーム側） */}
        <rect
          x="320"
          y="720"
          width="160"
          height="60"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 下のペナルティエリア */}
        <rect
          x="250"
          y="630"
          width="300"
          height="150"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* 下のペナルティスポット */}
        <circle cx="400" cy="670" r="3" fill="white" />

        {/* 下のゴール */}
        <rect
          x="370"
          y="775"
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
          d="M 320 630 A 80 80 0 0 0 480 630"
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
          d="M 35 780 A 15 15 0 0 1 20 765"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M 765 780 A 15 15 0 0 0 780 765"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />

        {/* ゴールサイド表示 */}
        <g>
          {/* 上側（アウェイ陣地） */}
          <rect
            x="330"
            y="50"
            width="140"
            height="30"
            fill="rgba(220, 53, 69, 0.8)"
            rx="15"
          />
          <text
            x="400"
            y="70"
            className="goal-label"
            fill="white"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            AWAY GOAL
          </text>

          {/* 下側（ホーム陣地） */}
          <rect
            x="330"
            y="720"
            width="140"
            height="30"
            fill="rgba(0, 123, 255, 0.8)"
            rx="15"
          />
          <text
            x="400"
            y="740"
            className="goal-label"
            fill="white"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
          >
            HOME GOAL
          </text>
        </g>

        {/* サイドライン方向矢印 */}
        <g>
          {/* 左サイド - ホームからアウェイ方向 */}
          <path
            d="M 10 720 L 10 80"
            stroke="rgba(0, 123, 255, 0.6)"
            strokeWidth="5"
            markerEnd="url(#arrowhead-blue)"
          />

          {/* 右サイド - アウェイからホーム方向 */}
          <path
            d="M 790 80 L 790 720"
            stroke="rgba(220, 53, 69, 0.6)"
            strokeWidth="5"
            markerEnd="url(#arrowhead-red)"
          />
        </g>

        {/* ハーフライン境界の視覚的ヒント */}
        <g opacity="0.3">
          {/* ホーム側制限エリア表示 */}
          <rect
            x="20"
            y="420"
            width="760"
            height="360"
            fill="rgba(0, 123, 255, 0.1)"
            stroke="rgba(0, 123, 255, 0.3)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />
          <text
            x="400"
            y="600"
            textAnchor="middle"
            fontSize="24"
            fill="rgba(0, 123, 255, 0.5)"
            fontWeight="bold"
          >
            HOME AREA
          </text>

          {/* アウェイ側制限エリア表示 */}
          <rect
            x="20"
            y="20"
            width="760"
            height="360"
            fill="rgba(220, 53, 69, 0.1)"
            stroke="rgba(220, 53, 69, 0.3)"
            strokeWidth="2"
            strokeDasharray="10,5"
          />
          <text
            x="400"
            y="200"
            textAnchor="middle"
            fontSize="24"
            fill="rgba(220, 53, 69, 0.5)"
            fontWeight="bold"
          >
            AWAY AREA
          </text>

          {/* センターライン強調 */}
          <line
            x1="20"
            y1="400"
            x2="780"
            y2="400"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </g>

        {/* 矢印マーカー定義 */}
        <defs>
          <marker
            id="arrowhead-blue"
            markerWidth="12"
            markerHeight="9"
            refX="11"
            refY="4.5"
            orient="auto"
          >
            <polygon points="0 0, 12 4.5, 0 9" fill="rgba(0, 123, 255, 0.8)" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="12"
            markerHeight="9"
            refX="11"
            refY="4.5"
            orient="auto"
          >
            <polygon points="0 0, 12 4.5, 0 9" fill="rgba(220, 53, 69, 0.8)" />
          </marker>
        </defs>

        {/* 選手の描画 */}
        {homePlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            isHighlighted={highlightedPlayer === player.id}
          />
        ))}

        {awayPlayers.map((player) => (
          <Player
            key={player.id}
            player={player}
            onDrag={onPlayerDrag}
            isHighlighted={highlightedPlayer === player.id}
          />
        ))}
      </svg>
    </div>
  );
};

export default SoccerPitch;
