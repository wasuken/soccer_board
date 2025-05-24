import React from 'react';
import { Player as PlayerType } from '../types';

interface PlayerProps {
  player: PlayerType;
  onDrag: (playerId: string, newPosition: { x: number; y: number }) => void;
  displayMode: 'number' | 'initial';
}

const Player: React.FC<PlayerProps> = ({ player, onDrag, displayMode }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const newX = moveEvent.clientX - rect.left;
      const newY = moveEvent.clientY - rect.top;
      
      // ピッチ内に制限
      const boundedX = Math.max(20, Math.min(780, newX));
      const boundedY = Math.max(20, Math.min(580, newY));
      
      onDrag(player.id, { x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getDisplayText = () => {
    if (displayMode === 'number') {
      return player.number.toString();
    } else {
      // イニシャル表示（名前の最初の文字）
      return player.name.charAt(0).toUpperCase();
    }
  };

  return (
    <g 
      className={`player ${player.team === 'home' ? 'player-home' : 'player-away'}`}
      transform={`translate(${player.position.x}, ${player.position.y})`}
      onMouseDown={handleMouseDown}
    >
      <circle
        r="20"
        className={player.team === 'home' ? 'player-home' : 'player-away'}
      />
      {/* 白い背景円で文字をくっきり見せる */}
      <circle
        r="12"
        fill="#ffffff"
        fillOpacity="0.9"
      />
      <text
        className="player-number"
        dy="1"
        fill="#000000"
      >
        {getDisplayText()}
      </text>
    </g>
  );
};

export default Player;
