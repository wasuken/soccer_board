import React from "react";
import { Formation } from "../types";
import { PRESET_FORMATIONS } from "../data/formations";

interface FormationSelectorProps {
  selectedFormation: string;
  onFormationChange: (formationId: string) => void;
  team: "home" | "away";
  currentPhase: "basic" | "attack" | "defense";
  onPhaseChange: (phase: "basic" | "attack" | "defense") => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  selectedFormation,
  onFormationChange,
  team,
  currentPhase,
  onPhaseChange,
}) => {
  return (
    <div
      className={`formation-selector p-3 mb-3 ${team === "home" ? "border-primary" : "border-danger"}`}
    >
      <h6
        className={`mb-3 ${team === "home" ? "text-primary" : "text-danger"}`}
      >
        {team === "home" ? "ホームチーム" : "アウェイチーム"} フォーメーション
      </h6>

      {/* フォーメーション選択 */}
      <div className="mb-3">
        <label className="form-label fw-bold">基本フォーメーション</label>
        <select
          className="form-select form-select-sm"
          value={selectedFormation}
          onChange={(e) => onFormationChange(e.target.value)}
        >
          {PRESET_FORMATIONS.map((formation) => (
            <option key={formation.id} value={formation.id}>
              {formation.name}
            </option>
          ))}
        </select>
        <div className="form-text">
          {
            PRESET_FORMATIONS.find((f) => f.id === selectedFormation)
              ?.description
          }
        </div>
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
            checked={currentPhase === "basic"}
            onChange={() => onPhaseChange("basic")}
          />
          <label
            className="btn btn-outline-secondary btn-sm"
            htmlFor={`basic-${team}`}
          >
            基本
          </label>

          <input
            type="radio"
            className="btn-check"
            name={`phase-${team}`}
            id={`attack-${team}`}
            checked={currentPhase === "attack"}
            onChange={() => onPhaseChange("attack")}
          />
          <label
            className="btn btn-outline-success btn-sm"
            htmlFor={`attack-${team}`}
          >
            攻撃
          </label>

          <input
            type="radio"
            className="btn-check"
            name={`phase-${team}`}
            id={`defense-${team}`}
            checked={currentPhase === "defense"}
            onChange={() => onPhaseChange("defense")}
          />
          <label
            className="btn btn-outline-warning btn-sm"
            htmlFor={`defense-${team}`}
          >
            守備
          </label>
        </div>
      </div>
    </div>
  );
};

export default FormationSelector;
