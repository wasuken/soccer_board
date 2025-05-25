import React from "react";
import FormationSelector from "./FormationSelector";
import PlayerList from "./PlayerList";
import AutoNumbering from "./AutoNumbering";
import TeamSelector from "./TeamSelector";
import PlayerLoader from "./PlayerLoader";
import { Team, Formation } from "../types";
import { TeamData } from "./TeamSelector";

interface TeamBlockProps {
  team: "home" | "away";
  teamData: Team;
  selectedTeamData: TeamData | null;
  selectedFormation: string;
  allFormations: Formation[];
  onTeamSelect: (teamData: TeamData | null) => void;
  onPlayersLoaded: (players: any[]) => void;
  onFormationChange: (formationId: string) => void;
  onCreateCustom: () => void;
  onDeleteCustom: (formationId: string) => void;
  onPhaseChange: (phase: "basic" | "attack" | "defense") => void;
  onTeamNameChange: (name: string) => void;
  onPlayerUpdate: (playerId: string, updates: any) => void;
  onPlayerFocus: (playerId: string) => void;
  onAutoNumbering: (updates: Array<{ id: string; number: number }>) => void;
}

const TeamBlock: React.FC<TeamBlockProps> = ({
  team,
  teamData,
  selectedTeamData,
  selectedFormation,
  allFormations,
  onTeamSelect,
  onPlayersLoaded,
  onFormationChange,
  onCreateCustom,
  onDeleteCustom,
  onPhaseChange,
  onTeamNameChange,
  onPlayerUpdate,
  onPlayerFocus,
  onAutoNumbering,
}) => {
  const isHome = team === "home";

  return (
    <div className={`card h-100 border-${isHome ? "primary" : "danger"}`}>
      <div
        className={`card-header bg-${isHome ? "primary" : "danger"} text-white`}
      >
        <h5 className="mb-0">
          {isHome ? "🏠 ホームチーム" : "✈️ アウェイチーム"}
        </h5>
      </div>

      <div className="card-body">
        {/* チーム選択 */}
        <TeamSelector
          selectedTeam={selectedTeamData}
          onTeamSelect={onTeamSelect}
          team={team}
        />

        {/* 選手ローダー */}
        {selectedTeamData && (
          <div className="mt-3">
            <PlayerLoader
              selectedTeam={selectedTeamData}
              onPlayersLoaded={onPlayersLoaded}
              team={team}
            />
          </div>
        )}

        {/* フォーメーション選択 */}
        <div className="mt-3">
          <FormationSelector
            formations={allFormations}
            selectedFormation={selectedFormation}
            onFormationChange={onFormationChange}
            onCreateCustom={onCreateCustom}
            onDeleteCustom={onDeleteCustom}
            team={team}
            currentPhase={teamData.currentPhase}
            onPhaseChange={onPhaseChange}
          />
        </div>

        {/* チーム名編集 */}
        <div className="mt-3">
          <label className="form-label fw-bold">チーム名</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={teamData.name}
            onChange={(e) => onTeamNameChange(e.target.value)}
          />
        </div>

        {/* 選手リスト */}
        <div className="mt-3">
          <PlayerList
            players={teamData.players}
            team={team}
            onPlayerUpdate={onPlayerUpdate}
            onPlayerFocus={onPlayerFocus}
          />
        </div>

        {/* 自動背番号 */}
        <div className="mt-3">
          <AutoNumbering
            players={teamData.players}
            team={team}
            onApplyNumbering={onAutoNumbering}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamBlock;
