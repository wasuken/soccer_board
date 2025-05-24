import React, { useState } from 'react';
import { Formation, Position } from '../types';

interface CustomFormationModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (formation: Formation) => void;
  currentPositions: Position[];
  team: 'home' | 'away';
}

const CustomFormationModal: React.FC<CustomFormationModalProps> = ({
  show,
  onClose,
  onSave,
  currentPositions,
  team
}) => {
  const [formationName, setFormationName] = useState('');
  const [formationDescription, setFormationDescription] = useState('');

  const handleSave = () => {
    if (!formationName.trim()) {
      alert('フォーメーション名を入力してください');
      return;
    }

    const newFormation: Formation = {
      id: `custom-${Date.now()}`,
      name: formationName.trim(),
      description: formationDescription.trim() || undefined,
      positions: currentPositions.map(pos => ({ ...pos }))
    };

    onSave(newFormation);
    setFormationName('');
    setFormationDescription('');
    onClose();
  };

  const handleClose = () => {
    setFormationName('');
    setFormationDescription('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className={`modal-title ${team === 'home' ? 'text-primary' : 'text-danger'}`}>
              🎯 カスタムフォーメーション作成
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label fw-bold">フォーメーション名 *</label>
              <input
                type="text"
                className="form-control"
                value={formationName}
                onChange={(e) => setFormationName(e.target.value)}
                placeholder="例: 4-3-3 (攻撃的)"
                maxLength={50}
              />
              <div className="form-text">現在の選手配置を保存します</div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold">説明（任意）</label>
              <textarea
                className="form-control"
                rows={3}
                value={formationDescription}
                onChange={(e) => setFormationDescription(e.target.value)}
                placeholder="このフォーメーションの特徴や使用場面を記入"
                maxLength={200}
              />
            </div>

            <div className="alert alert-info">
              <strong>💡 ヒント:</strong> 現在ピッチ上の{team === 'home' ? 'ホームチーム' : 'アウェイチーム'}の選手配置が保存されます。
              保存後は、フォーメーション選択リストから呼び出せます。
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSave}
            >
              💾 保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFormationModal;
