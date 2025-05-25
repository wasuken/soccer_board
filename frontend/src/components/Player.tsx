import React from "react";
import { Player as PlayerType } from "../types";

interface PlayerProps {
  player: PlayerType;
  onDrag: (playerId: string, newPosition: { x: number; y: number }) => void;
  isHighlighted?: boolean;
}

const Player: React.FC<PlayerProps> = ({
  player,
  onDrag,
  isHighlighted = false,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = svg.getBoundingClientRect();

      // SVGのviewBoxサイズ（800x800）
      const viewBoxWidth = 800;
      const viewBoxHeight = 800;

      // 実際のSVGサイズ
      const svgWidth = rect.width;
      const svgHeight = rect.height;

      // マウス座標をviewBox座標系に変換
      const scaleX = viewBoxWidth / svgWidth;
      const scaleY = viewBoxHeight / svgHeight;

      const newX = (moveEvent.clientX - rect.left) * scaleX;
      const newY = (moveEvent.clientY - rect.top) * scaleY;

      // ピッチ内に制限（viewBox座標系で）
      const boundedX = Math.max(25, Math.min(775, newX));
      let boundedY = Math.max(25, Math.min(775, newY));

      // ハーフライン制限を緩和（もう少し相手陣営に入れるように）
      if (player.team === "home") {
        // ホームチーム: Y座標420-775（センターラインを少し超えられる）
        boundedY = Math.max(420, Math.min(775, boundedY));
      } else {
        // アウェイチーム: Y座標25-380（センターラインを少し超えられる）
        boundedY = Math.max(25, Math.min(380, boundedY));
      }

      onDrag(player.id, { x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 名前を短縮表示（長すぎる場合）
  const getDisplayName = () => {
    if (player.name.length > 8) {
      return player.name.substring(0, 7) + "...";
    }
    return player.name;
  };

  return (
    <g
      className={`player ${player.team === "home" ? "player-home" : "player-away"}`}
      transform={`translate(${player.position.x}, ${player.position.y})`}
      onMouseDown={handleMouseDown}
    >
      {/* ハイライト表示用の外側円 */}
      {isHighlighted && (
        <circle
          r="30"
          fill="none"
          stroke="#ffc107"
          strokeWidth="3"
          strokeDasharray="5,3"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* プレイヤーの円 */}
      <circle
        r="22"
        className={player.team === "home" ? "player-home" : "player-away"}
      />

      {/* 背番号用の白い背景円 */}
      <circle r="14" fill="#ffffff" fillOpacity="0.9" />

      {/* 背番号 */}
      <text className="player-number" dy="1" fill="#000000">
        {player.number}
      </text>

      {/* プレイヤー名（円の下に表示） */}
      <text
        className="player-name"
        y="40"
        fill="white"
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        stroke="rgba(0,0,0,0.8)"
        strokeWidth="0.5"
      >
        {getDisplayName()}
      </text>
    </g>
  );
};

export default Player;
