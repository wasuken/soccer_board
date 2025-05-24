import React, { useState } from 'react';
import { Player, PlayerPosition } from '../types';

interface PlayerListProps {
  players: Player[];
  team: 'home' | 'away';
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
  onPlayerFocus: (playerId: string) => void;
}

const POSITION_LABELS: Record<PlayerPosition, string> = {
  'GK': 'ゴールキーパー',
  'DF': 'ディフェンダー', 
  'MF': 'ミッドフィールダー',
  'FW': 'フォワード'
};

const POSITION_COLORS: Record<PlayerPosition, string> = {
  'GK': 'bg-warning',
  'DF': 'bg-info',
  'MF': 'bg-success', 
  'FW': 'bg-danger'
};

const POSITION_ORDER: Record<PlayerPosition, number> = {
  'GK': 1,
  'DF': 2,
  'MF': 3,
  'FW': 4
};

interface PlayerListProps {
  players: Player[];
  team: 'home' | 'away';
  onPlayerUpdate: (playerId: string, updates: Partial<Player>) => void;
  onPlayerFocus: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  team,
  onPlayerUpdate,
  onPlayerFocus
}) => {
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ 
    name: string; 
    number: number; 
    playerPosition: PlayerPosition 
  }>({
    name: '',
    number: 1,
    playerPosition: 'MF'
  });

  const handleEditStart = (player: Player) => {
    setEditingPlayer(player.id);
    setEditValues({
      name: player.name,
      number: player.number,
      playerPosition: player.playerPosition
    });
  };

  const handleEditSave = () => {
    if (!editingPlayer) return;
    
    // 背番号の重複チェック
    const isDuplicate = players.some(p => 
      p.id !== editingPlayer && p.number === editValues.number
    );
    
    if (isDuplicate) {
      alert(`背番号 ${editValues.number} は既に使用されています`);
      return;
    }

    onPlayerUpdate(editingPlayer, {
      name: editValues.name.trim() || '選手',
      number: editValues.number,
      playerPosition: editValues.playerPosition
    });
    
    setEditingPlayer(null);
  };

  const handleEditCancel = () => {
    setEditingPlayer(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className={`mb-0 ${team === 'home' ? 'text-primary' : 'text-danger'}`}>
          👥 {team === 'home' ? 'ホーム' : 'アウェイ'}チーム選手一覧
        </h6>
        <small className="text-muted">{players.length}名</small>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th style={{ width: '60px' }}>背番号</th>
                <th style={{ width: '80px' }}>ポジション</th>
                <th>選手名</th>
                <th style={{ width: '80px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {players
                .sort((a, b) => {
                  // ポジション順 → 背番号順でソート
                  const posOrder = POSITION_ORDER[a.playerPosition] - POSITION_ORDER[b.playerPosition];
                  return posOrder !== 0 ? posOrder : a.number - b.number;
                })
                .map(player => (
                <tr key={player.id} className="align-middle">
                  <td>
                    {editingPlayer === player.id ? (
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ width: '50px' }}
                        value={editValues.number}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          number: Math.max(1, Math.min(99, parseInt(e.target.value) || 1))
                        }))}
                        onKeyDown={handleKeyPress}
                        min="1"
                        max="99"
                        autoFocus
                      />
                    ) : (
                      <span className={`badge ${team === 'home' ? 'bg-primary' : 'bg-danger'}`}>
                        {player.number}
                      </span>
                    )}
                  </td>
                  
                  <td>
                    {editingPlayer === player.id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editValues.playerPosition}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          playerPosition: e.target.value as PlayerPosition
                        }))}
                      >
                        {Object.entries(POSITION_LABELS).map(([pos, label]) => (
                          <option key={pos} value={pos}>
                            {pos} - {label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`badge ${POSITION_COLORS[player.playerPosition]} text-dark`}>
                        {player.playerPosition}
                      </span>
                    )}
                  </td>
                  
                  <td>
                    {editingPlayer === player.id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editValues.name}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        onKeyDown={handleKeyPress}
                        maxLength={20}
                        placeholder="選手名"
                      />
                    ) : (
                      <span 
                        className="text-truncate d-inline-block" 
                        style={{ maxWidth: '120px' }}
                        title={player.name}
                      >
                        {player.name}
                      </span>
                    )}
                  </td>
                  
                  <td>
                    {editingPlayer === player.id ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={handleEditSave}
                          title="保存"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleEditCancel}
                          title="キャンセル"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditStart(player)}
                          title="編集"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => onPlayerFocus(player.id)}
                          title="ピッチ上で強調表示"
                        >
                          📍
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            💡 ✏️で編集、📍でピッチ上の選手を強調表示
          </small>
          <div className="d-flex gap-1">
            <small className="badge bg-warning text-dark">GK</small>
            <small className="badge bg-info text-dark">DF</small>
            <small className="badge bg-success text-dark">MF</small>
            <small className="badge bg-danger text-dark">FW</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
