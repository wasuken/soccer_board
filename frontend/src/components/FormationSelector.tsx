import React from 'react';
import { Formation } from '../types';

interface FormationSelectorProps {
  formations: Formation[];
  selectedFormation: string;
  onFormationChange: (formationId: string) => void;
  onCreateCustom: () => void;
  onDeleteCustom: (formationId: string) => void;
  team: 'home' | 'away';
  currentPhase: 'basic' | 'attack' | 'defense';
  onPhaseChange: (phase: 'basic' | 'attack' | 'defense') => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  selectedFormation,
  onFormationChange,
  onCreateCustom,
  onDeleteCustom,
  team,
  currentPhase,
  onPhaseChange
}) => {
  const selectedFormationData = formations.find(f => f.id === selectedFormation);

  return (
    <div className={`formation-selector p-3 mb-3 ${team === 'home' ? 'border-primary' : 'border-danger'}`}>
      <h6 className={`mb-3 ${team === 'home' ? 'text-primary' : 'text-danger'}`}>
        {team === 'home' ? 'ホームチーム' : 'アウェイチーム'} フォーメーション
      </h6>
      
      {/* フォーメーション選択 */}
      <div className="mb-3">
        <label className="form-label fw-bold">フォーメーション</label>
        <div className="input-group">
          <select 
            className="form-select form-select-sm"
            value={selectedFormation}
            onChange={(e) => onFormationChange(e.target.value)}
          >
            <optgroup label="プリセット">
              {formations.filter(f => !f.id.startsWith('custom-')).map(formation => (
                <option key={formation.id} value={formation.id}>
                  {formation.name}
                </option>
              ))}
            </optgroup>
            {formations.some(f => f.id.startsWith('custom-')) && (
              <optgroup label="カスタム">
                {formations.filter(f => f.id.startsWith('custom-')).map(formation => (
                  <option key={formation.id} value={formation.id}>
                    {formation.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <button 
            className="btn btn-outline-success btn-sm"
            onClick={onCreateCustom}
            title="現在の配置をカスタムフォーメーションとして保存"
          >
            ➕
          </button>
        </div>
        
        {selectedFormationData?.description && (
          <div className="form-text">
            {selectedFormationData.description}
          </div>
        )}
        
        {selectedFormation.startsWith('custom-') && (
          <button
            className="btn btn-outline-danger btn-sm mt-2 w-100"
            onClick={() => {
              if (confirm('このカスタムフォーメーションを削除しますか？')) {
                onDeleteCustom(selectedFormation);
              }
            }}
          >
            🗑️ このカスタムフォーメーションを削除
          </button>
        )}
      </div>

      {/* 戦術フェーズ選択 */}
      <div className="mb-2">
        <label className="form-label fw-bold">戦術フェーズ</label>
        <div className="btn-group w-100" role="group">
          <input 
            type="radio" 
            className="btn-check" 
            name={`phase-${team}`} 
            id={`basic-${team}`}
            checked={currentPhase === 'basic'}
            onChange={() => onPhaseChange('basic')}
          />
          <label className="btn btn-outline-secondary btn-sm" htmlFor={`basic-${team}`}>
            基本
          </label>

          <input 
            type="radio" 
            className="btn-check" 
            name={`phase-${team}`} 
            id={`attack-${team}`}
            checked={currentPhase === 'attack'}
            onChange={() => onPhaseChange('attack')}
          />
          <label className="btn btn-outline-success btn-sm" htmlFor={`attack-${team}`}>
            攻撃
          </label>

          <input 
            type="radio" 
            className="btn-check" 
            name={`phase-${team}`} 
            id={`defense-${team}`}
            checked={currentPhase === 'defense'}
            onChange={() => onPhaseChange('defense')}
          />
          <label className="btn btn-outline-warning btn-sm" htmlFor={`defense-${team}`}>
            守備
          </label>
        </div>
      </div>
    </div>
  );
};

export default FormationSelector;
