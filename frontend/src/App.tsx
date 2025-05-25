import React, { useState } from "react";
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
  const [showDataModal, setShowDataModal] = useState(false);

  const dataManager = useDataManager({
    homeTeam: matchManager.homeTeam,
    awayTeam: matchManager.awayTeam,
    customFormations: formationManager.customFormations,
    homeSelectedFormation: formationManager.homeSelectedFormation,
    awaySelectedFormation: formationManager.awaySelectedFormation,
    selectedHomeTeamData: matchManager.selectedHomeTeamData,
    selectedAwayTeamData: matchManager.selectedAwayTeamData,
    setHomeTeam: matchManager.setHomeTeam,
    setAwayTeam: matchManager.setAwayTeam,
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
          <h1 className="display-6 text-center mb-3">⚽ 蹴板</h1>

          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={matchManager.swapTeams}
                  >
                    🔄 チーム入れ替え
                  </button>
                </div>

                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-fill"
                      onClick={dataManager.saveToLocalStorage}
                    >
                      💾 保存
                    </button>
                    <button
                      className="btn btn-info flex-fill"
                      onClick={dataManager.loadFromLocalStorage}
                      disabled={!dataManager.hasSavedData}
                    >
                      📁 読み込み
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setShowDataModal(true)}
                    >
                      ⚙️
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
                    <li>📍 選手名表示とハイライト</li>
                    <li>📍 選手リストで強調表示</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* データ管理モーダル */}
      {showDataModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">💾 データ管理</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDataModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  {/* メモリ操作 */}
                  <div className="col-12">
                    <h6 className="text-primary">📄 メモリ保存</h6>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          dataManager.saveToLocalStorage();
                          setShowDataModal(false);
                        }}
                      >
                        💾 現在の状態を保存
                      </button>
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          dataManager.loadFromLocalStorage();
                          setShowDataModal(false);
                        }}
                        disabled={!dataManager.hasSavedData}
                      >
                        📁 保存した状態を読み込み
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={dataManager.createSnapshot}
                      >
                        📸 スナップショット作成
                      </button>
                    </div>
                  </div>

                  {/* ファイル操作 */}
                  <div className="col-12">
                    <h6 className="text-success">💿 ファイル操作</h6>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-success"
                        onClick={dataManager.exportData}
                      >
                        📤 JSONファイルにエクスポート
                      </button>
                      <button
                        className="btn btn-outline-info"
                        onClick={dataManager.importData}
                      >
                        📥 JSONファイルからインポート
                      </button>
                    </div>
                  </div>

                  {/* 履歴 */}
                  {dataManager.saveHistory.length > 0 && (
                    <div className="col-12">
                      <h6 className="text-warning">📚 保存履歴</h6>
                      <div className="list-group">
                        {dataManager.saveHistory
                          .slice(0, 5)
                          .map((data, index) => (
                            <button
                              key={index}
                              className="list-group-item list-group-item-action"
                              onClick={() => {
                                dataManager.loadFromHistory(data);
                                setShowDataModal(false);
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <span>
                                  {data.homeTeam.name} vs {data.awayTeam.name}
                                </span>
                                <small className="text-muted">
                                  {new Date(data.timestamp).toLocaleString()}
                                </small>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* 危険な操作 */}
                  <div className="col-12">
                    <h6 className="text-danger">⚠️ 危険な操作</h6>
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => {
                        dataManager.resetData();
                        setShowDataModal(false);
                      }}
                    >
                      🗑️ 全データをリセット
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDataModal(false)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* 隠しファイル入力 */}
      <input
        type="file"
        ref={dataManager.fileInputRef}
        onChange={dataManager.handleFileSelect}
        accept=".json"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default App;
