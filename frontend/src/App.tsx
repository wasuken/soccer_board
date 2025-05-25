import React from "react";
import SoccerPitch from "./components/SoccerPitch";
import CustomFormationModal from "./components/CustomFormationModal";
import TeamBlock from "./components/TeamBlock";
import { useMatchManager } from "./hooks/useMatchManager";
import { useFormationManager } from "./hooks/useFormationManager";
import { usePlayerManager } from "./hooks/usePlayerManager";
import { useDataManager } from "./hooks/useDataManager";

const App: React.FC = () => {
  const matchManager = useMatchManager();
  const formationManager = useFormationManager();
  const playerManager = usePlayerManager();

  const dataManager = useDataManager({
    homeTeam: matchManager.homeTeam,
    awayTeam: matchManager.awayTeam,
    displayMode: matchManager.displayMode,
    customFormations: formationManager.customFormations,
    homeSelectedFormation: formationManager.homeSelectedFormation,
    awaySelectedFormation: formationManager.awaySelectedFormation,
    selectedHomeTeamData: matchManager.selectedHomeTeamData,
    selectedAwayTeamData: matchManager.selectedAwayTeamData,
    setHomeTeam: matchManager.setHomeTeam,
    setAwayTeam: matchManager.setAwayTeam,
    setDisplayMode: matchManager.setDisplayMode,
    setCustomFormations: formationManager.setCustomFormations,
    setHomeSelectedFormation: formationManager.setHomeSelectedFormation,
    setAwaySelectedFormation: formationManager.setAwaySelectedFormation,
    setSelectedHomeTeamData: (data) =>
      matchManager.handleTeamSelect("home", data),
    setSelectedAwayTeamData: (data) =>
      matchManager.handleTeamSelect("away", data),
  });

  return (
    <div className="container-fluid py-3">
      {/* ヘッダー */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-6 text-center mb-3">
            ⚽ Soccer Tactical Board
          </h1>

          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="displayMode"
                      id="number-mode"
                      checked={matchManager.displayMode === "number"}
                      onChange={() => matchManager.setDisplayMode("number")}
                    />
                    <label
                      className="btn btn-outline-primary"
                      htmlFor="number-mode"
                    >
                      🔢 背番号表示
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="displayMode"
                      id="initial-mode"
                      checked={matchManager.displayMode === "initial"}
                      onChange={() => matchManager.setDisplayMode("initial")}
                    />
                    <label
                      className="btn btn-outline-primary"
                      htmlFor="initial-mode"
                    >
                      🔤 イニシャル表示
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary flex-fill"
                      onClick={matchManager.swapTeams}
                    >
                      🔄 チーム入れ替え
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={dataManager.saveToLocalStorage}
                    >
                      💾 保存
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={dataManager.loadFromLocalStorage}
                    >
                      📁 読み込み
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* ホームチームブロック */}
        <div className="col-xl-3 col-lg-6 mb-4">
          <TeamBlock
            team="home"
            teamData={matchManager.homeTeam}
            selectedTeamData={matchManager.selectedHomeTeamData}
            selectedFormation={formationManager.homeSelectedFormation}
            allFormations={formationManager.allFormations}
            onTeamSelect={(teamData) =>
              matchManager.handleTeamSelect("home", teamData)
            }
            onPlayersLoaded={(players) =>
              matchManager.handlePlayersLoaded("home", players)
            }
            onFormationChange={(formationId) =>
              formationManager.handleFormationChange(
                "home",
                formationId,
                matchManager.homeTeam,
                matchManager.awayTeam,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onCreateCustom={() =>
              formationManager.handleCreateCustomFormation("home")
            }
            onDeleteCustom={formationManager.handleDeleteCustomFormation}
            onPhaseChange={(phase) =>
              formationManager.handlePhaseChange(
                "home",
                phase,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onTeamNameChange={(name) =>
              matchManager.setHomeTeam((prev) => ({ ...prev, name }))
            }
            onPlayerUpdate={(playerId, updates) =>
              playerManager.handlePlayerUpdate(
                playerId,
                updates,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onPlayerFocus={playerManager.handlePlayerFocus}
            onAutoNumbering={(updates) =>
              playerManager.handleAutoNumbering(
                "home",
                updates,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
          />
        </div>

        {/* メインピッチエリア */}
        <div className="col-xl-6 col-lg-12 mb-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">⚽ ピッチ</h5>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <SoccerPitch
                  homePlayers={matchManager.homeTeam.players}
                  awayPlayers={matchManager.awayTeam.players}
                  onPlayerDrag={(playerId, newPosition) =>
                    playerManager.handlePlayerDrag(
                      playerId,
                      newPosition,
                      matchManager.setHomeTeam,
                      matchManager.setAwayTeam,
                    )
                  }
                  displayMode={matchManager.displayMode}
                  highlightedPlayer={playerManager.highlightedPlayer}
                />
              </div>

              <div className="mt-3">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="badge bg-primary fs-6 p-2 me-2">
                        🏠 {matchManager.homeTeam.name}
                      </div>
                      <small className="text-muted">⬆️ 攻撃方向</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="badge bg-danger fs-6 p-2 me-2">
                        ✈️ {matchManager.awayTeam.name}
                      </div>
                      <small className="text-muted">⬇️ 攻撃方向</small>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <small className="text-muted">
                    💡 ピッチ上のラベルと矢印で攻撃方向を確認できます
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* アウェイチームブロック */}
        <div className="col-xl-3 col-lg-6 mb-4">
          <TeamBlock
            team="away"
            teamData={matchManager.awayTeam}
            selectedTeamData={matchManager.selectedAwayTeamData}
            selectedFormation={formationManager.awaySelectedFormation}
            allFormations={formationManager.allFormations}
            onTeamSelect={(teamData) =>
              matchManager.handleTeamSelect("away", teamData)
            }
            onPlayersLoaded={(players) =>
              matchManager.handlePlayersLoaded("away", players)
            }
            onFormationChange={(formationId) =>
              formationManager.handleFormationChange(
                "away",
                formationId,
                matchManager.homeTeam,
                matchManager.awayTeam,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onCreateCustom={() =>
              formationManager.handleCreateCustomFormation("away")
            }
            onDeleteCustom={formationManager.handleDeleteCustomFormation}
            onPhaseChange={(phase) =>
              formationManager.handlePhaseChange(
                "away",
                phase,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onTeamNameChange={(name) =>
              matchManager.setAwayTeam((prev) => ({ ...prev, name }))
            }
            onPlayerUpdate={(playerId, updates) =>
              playerManager.handlePlayerUpdate(
                playerId,
                updates,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
            onPlayerFocus={playerManager.handlePlayerFocus}
            onAutoNumbering={(updates) =>
              playerManager.handleAutoNumbering(
                "away",
                updates,
                matchManager.setHomeTeam,
                matchManager.setAwayTeam,
              )
            }
          />
        </div>
      </div>

      {/* 操作説明 */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">ℹ️ 操作方法</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled small mb-0">
                    <li>🖱️ 選手をドラッグして移動</li>
                    <li>🎯 フォーメーションで一括配置</li>
                    <li>⚡ 戦術フェーズで配置調整</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled small mb-0">
                    <li>💾 データの保存・読み込み</li>
                    <li>🔢 背番号/イニシャル切り替え</li>
                    <li>📍 選手リストで強調表示</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* カスタムフォーメーション作成モーダル */}
      <CustomFormationModal
        show={formationManager.showCustomModal}
        onClose={() => formationManager.setShowCustomModal(false)}
        onSave={formationManager.handleSaveCustomFormation}
        currentPositions={formationManager.getCurrentPositions(
          formationManager.modalTeam,
          matchManager.homeTeam,
          matchManager.awayTeam,
        )}
        team={formationManager.modalTeam}
      />
    </div>
  );
};

export default App;
