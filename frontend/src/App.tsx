import React, { useState, useEffect } from "react";
import SoccerPitch from "./components/SoccerPitch";
import FormationSelector from "./components/FormationSelector";
import CustomFormationModal from "./components/CustomFormationModal";
import PlayerList from "./components/PlayerList";
import AutoNumbering from "./components/AutoNumbering";
import TeamSelector, { TeamData } from "./components/TeamSelector";
import PlayerLoader from "./components/PlayerLoader";
import { Player, Team, Formation } from "./types";
import { PRESET_FORMATIONS, getFormationById } from "./data/formations";

const App: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<"number" | "initial">(
    "number",
  );
  const [customFormations, setCustomFormations] = useState<Formation[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalTeam, setModalTeam] = useState<"home" | "away">("home");
  const [homeSelectedFormation, setHomeSelectedFormation] = useState(
    PRESET_FORMATIONS[0].id,
  );
  const [awaySelectedFormation, setAwaySelectedFormation] = useState(
    PRESET_FORMATIONS[0].id,
  );
  const [highlightedPlayer, setHighlightedPlayer] = useState<
    string | undefined
  >();
  const [selectedHomeTeamData, setSelectedHomeTeamData] =
    useState<TeamData | null>(null);
  const [selectedAwayTeamData, setSelectedAwayTeamData] =
    useState<TeamData | null>(null);

  // 全フォーメーションリスト（プリセット + カスタム）
  const allFormations = [...PRESET_FORMATIONS, ...customFormations];

  // 初期チーム設定
  const [homeTeam, setHomeTeam] = useState<Team>(() => {
    const defaultFormation = PRESET_FORMATIONS[0];
    return {
      id: "home",
      name: "ホームチーム",
      players: defaultFormation.positions.map((pos, index) => ({
        id: `home-${index}`,
        name: `選手${index + 1}`,
        number: index + 1,
        position: { ...pos },
        playerPosition:
          index === 0 ? "GK" : index < 5 ? "DF" : index < 8 ? "MF" : "FW",
        team: "home",
      })),
      formations: {
        default: {
          basic: defaultFormation,
          attack: defaultFormation,
          defense: defaultFormation,
        },
      },
      currentFormation: "default",
      currentPhase: "basic",
    };
  });

  const [awayTeam, setAwayTeam] = useState<Team>(() => {
    const defaultFormation = PRESET_FORMATIONS[0];
    return {
      id: "away",
      name: "アウェイチーム",
      players: defaultFormation.positions.map((pos, index) => ({
        id: `away-${index}`,
        name: `選手${index + 1}`,
        number: index + 1,
        position: { x: pos.x, y: 600 - pos.y }, // Y座標を反転（相手陣営）
        playerPosition:
          index === 0 ? "GK" : index < 5 ? "DF" : index < 8 ? "MF" : "FW",
        team: "away",
      })),
      formations: {
        default: {
          basic: defaultFormation,
          attack: defaultFormation,
          defense: defaultFormation,
        },
      },
      currentFormation: "default",
      currentPhase: "basic",
    };
  });

  // 選手のドラッグ処理
  const handlePlayerDrag = (
    playerId: string,
    newPosition: { x: number; y: number },
  ) => {
    if (playerId.startsWith("home-")) {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId
            ? { ...player, position: newPosition }
            : player,
        ),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId
            ? { ...player, position: newPosition }
            : player,
        ),
      }));
    }
  };

  // フォーメーション変更処理
  const handleFormationChange = (
    team: "home" | "away",
    formationId: string,
  ) => {
    const formation = allFormations.find((f) => f.id === formationId);
    if (!formation) return;

    if (team === "home") {
      setHomeSelectedFormation(formationId);
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player, index) => ({
          ...player,
          position: formation.positions[index]
            ? { ...formation.positions[index] }
            : player.position,
        })),
      }));
    } else {
      setAwaySelectedFormation(formationId);
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player, index) => ({
          ...player,
          position: formation.positions[index]
            ? {
                x: formation.positions[index].x,
                y: 600 - formation.positions[index].y,
              }
            : player.position,
        })),
      }));
    }
  };

  // 選手データ更新
  const handlePlayerUpdate = (playerId: string, updates: Partial<Player>) => {
    if (playerId.startsWith("home-")) {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId ? { ...player, ...updates } : player,
        ),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId ? { ...player, ...updates } : player,
        ),
      }));
    }
  };

  // チーム選択処理
  const handleTeamSelect = (
    team: "home" | "away",
    teamData: TeamData | null,
  ) => {
    if (team === "home") {
      setSelectedHomeTeamData(teamData);
      if (teamData) {
        setHomeTeam((prev) => ({ ...prev, name: teamData.shortName }));
      }
    } else {
      setSelectedAwayTeamData(teamData);
      if (teamData) {
        setAwayTeam((prev) => ({ ...prev, name: teamData.shortName }));
      }
    }
  };

  // 選手データロード処理
  const handlePlayersLoaded = (team: "home" | "away", players: Player[]) => {
    if (team === "home") {
      setHomeTeam((prev) => ({ ...prev, players }));
    } else {
      setAwayTeam((prev) => ({ ...prev, players }));
    }
  };
  // 自動背番号設定
  const handleAutoNumbering = (
    team: "home" | "away",
    updates: Array<{ id: string; number: number }>,
  ) => {
    if (team === "home") {
      setHomeTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          const update = updates.find((u) => u.id === player.id);
          return update ? { ...player, number: update.number } : player;
        }),
      }));
    } else {
      setAwayTeam((prev) => ({
        ...prev,
        players: prev.players.map((player) => {
          const update = updates.find((u) => u.id === player.id);
          return update ? { ...player, number: update.number } : player;
        }),
      }));
    }
  };
  // 選手ハイライト表示
  const handlePlayerFocus = (playerId: string) => {
    setHighlightedPlayer(playerId);
    // 3秒後にハイライト解除
    setTimeout(() => {
      setHighlightedPlayer(undefined);
    }, 3000);
  };
  // カスタムフォーメーション作成
  const handleCreateCustomFormation = (team: "home" | "away") => {
    setModalTeam(team);
    setShowCustomModal(true);
  };

  const handleSaveCustomFormation = (formation: Formation) => {
    setCustomFormations((prev) => [...prev, formation]);
  };

  const handleDeleteCustomFormation = (formationId: string) => {
    setCustomFormations((prev) => prev.filter((f) => f.id !== formationId));

    // 削除されたフォーメーションが選択されていた場合はデフォルトに戻す
    if (homeSelectedFormation === formationId) {
      setHomeSelectedFormation(PRESET_FORMATIONS[0].id);
      handleFormationChange("home", PRESET_FORMATIONS[0].id);
    }
    if (awaySelectedFormation === formationId) {
      setAwaySelectedFormation(PRESET_FORMATIONS[0].id);
      handleFormationChange("away", PRESET_FORMATIONS[0].id);
    }
  };

  // 現在の選手配置を取得
  const getCurrentPositions = (team: "home" | "away") => {
    return team === "home"
      ? homeTeam.players.map((p) => p.position)
      : awayTeam.players.map((p) => ({
          x: p.position.x,
          y: 600 - p.position.y,
        })); // アウェイは反転して保存
  };

  // 戦術フェーズ変更（今後の拡張用）
  const handlePhaseChange = (
    team: "home" | "away",
    phase: "basic" | "attack" | "defense",
  ) => {
    if (team === "home") {
      setHomeTeam((prev) => ({ ...prev, currentPhase: phase }));
    } else {
      setAwayTeam((prev) => ({ ...prev, currentPhase: phase }));
    }
  };

  // データの保存・読み込み（カスタムフォーメーション含む）
  const saveToLocalStorage = () => {
    const data = {
      homeTeam,
      awayTeam,
      displayMode,
      customFormations,
      homeSelectedFormation,
      awaySelectedFormation,
      selectedHomeTeamData,
      selectedAwayTeamData,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("soccerTacticalBoard", JSON.stringify(data));
    alert("データを保存しました");
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("soccerTacticalBoard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHomeTeam(data.homeTeam);
        setAwayTeam(data.awayTeam);
        setDisplayMode(data.displayMode || "number");
        setCustomFormations(data.customFormations || []);
        setHomeSelectedFormation(
          data.homeSelectedFormation || PRESET_FORMATIONS[0].id,
        );
        setAwaySelectedFormation(
          data.awaySelectedFormation || PRESET_FORMATIONS[0].id,
        );
        setSelectedHomeTeamData(data.selectedHomeTeamData || null);
        setSelectedAwayTeamData(data.selectedAwayTeamData || null);
        alert("データを読み込みました");
      } catch (error) {
        alert("データの読み込みに失敗しました");
      }
    } else {
      alert("保存されたデータがありません");
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* ヘッダー */}
        <div className="col-12 mb-4">
          <h1 className="display-6 text-center mb-3">
            ⚽ Soccer Tactical Board
          </h1>
          <div className="d-flex justify-content-center gap-3 mb-3">
            <div className="btn-group">
              <input
                type="radio"
                className="btn-check"
                name="displayMode"
                id="number-mode"
                checked={displayMode === "number"}
                onChange={() => setDisplayMode("number")}
              />
              <label className="btn btn-outline-primary" htmlFor="number-mode">
                背番号表示
              </label>

              <input
                type="radio"
                className="btn-check"
                name="displayMode"
                id="initial-mode"
                checked={displayMode === "initial"}
                onChange={() => setDisplayMode("initial")}
              />
              <label className="btn btn-outline-primary" htmlFor="initial-mode">
                イニシャル表示
              </label>
            </div>

            <button className="btn btn-success" onClick={saveToLocalStorage}>
              💾 保存
            </button>
            <button className="btn btn-info" onClick={loadFromLocalStorage}>
              📁 読み込み
            </button>
          </div>
        </div>

        {/* サイドバー */}
        <div className="col-lg-3 col-md-4">
          {/* チーム選択 */}
          <TeamSelector
            selectedTeam={selectedHomeTeamData}
            onTeamSelect={(teamData) => handleTeamSelect("home", teamData)}
            team="home"
          />

          <div className="mt-3">
            <TeamSelector
              selectedTeam={selectedAwayTeamData}
              onTeamSelect={(teamData) => handleTeamSelect("away", teamData)}
              team="away"
            />
          </div>

          {/* 選手ローダー */}
          {selectedHomeTeamData && (
            <div className="mt-3">
              <PlayerLoader
                selectedTeam={selectedHomeTeamData}
                onPlayersLoaded={(players) =>
                  handlePlayersLoaded("home", players)
                }
                team="home"
              />
            </div>
          )}

          {selectedAwayTeamData && (
            <div className="mt-3">
              <PlayerLoader
                selectedTeam={selectedAwayTeamData}
                onPlayersLoaded={(players) =>
                  handlePlayersLoaded("away", players)
                }
                team="away"
              />
            </div>
          )}

          <div className="mt-3">
            <FormationSelector
              formations={allFormations}
              selectedFormation={homeSelectedFormation}
              onFormationChange={(formationId) =>
                handleFormationChange("home", formationId)
              }
              onCreateCustom={() => handleCreateCustomFormation("home")}
              onDeleteCustom={handleDeleteCustomFormation}
              team="home"
              currentPhase={homeTeam.currentPhase}
              onPhaseChange={(phase) => handlePhaseChange("home", phase)}
            />
          </div>

          <div className="mt-3">
            <FormationSelector
              formations={allFormations}
              selectedFormation={awaySelectedFormation}
              onFormationChange={(formationId) =>
                handleFormationChange("away", formationId)
              }
              onCreateCustom={() => handleCreateCustomFormation("away")}
              onDeleteCustom={handleDeleteCustomFormation}
              team="away"
              currentPhase={awayTeam.currentPhase}
              onPhaseChange={(phase) => handlePhaseChange("away", phase)}
            />
          </div>

          {/* 選手リスト */}
          <div className="mt-3">
            <PlayerList
              players={homeTeam.players}
              team="home"
              onPlayerUpdate={handlePlayerUpdate}
              onPlayerFocus={handlePlayerFocus}
            />
          </div>

          <div className="mt-3">
            <AutoNumbering
              players={homeTeam.players}
              team="home"
              onApplyNumbering={(updates) =>
                handleAutoNumbering("home", updates)
              }
            />
          </div>

          <div className="mt-3">
            <PlayerList
              players={awayTeam.players}
              team="away"
              onPlayerUpdate={handlePlayerUpdate}
              onPlayerFocus={handlePlayerFocus}
            />
          </div>

          <div className="mt-3">
            <AutoNumbering
              players={awayTeam.players}
              team="away"
              onApplyNumbering={(updates) =>
                handleAutoNumbering("away", updates)
              }
            />
          </div>

          {/* チーム情報 */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">📊 チーム情報</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">ホームチーム名</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={homeTeam.name}
                  onChange={(e) =>
                    setHomeTeam((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">アウェイチーム名</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={awayTeam.name}
                  onChange={(e) =>
                    setAwayTeam((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="d-grid">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    // チーム入れ替え
                    const tempTeam = { ...homeTeam };
                    setHomeTeam({
                      ...awayTeam,
                      id: "home",
                      players: awayTeam.players.map((p) => ({
                        ...p,
                        id: p.id.replace("away-", "home-"),
                        team: "home",
                        position: { x: p.position.x, y: 600 - p.position.y },
                      })),
                    });
                    setAwayTeam({
                      ...tempTeam,
                      id: "away",
                      players: tempTeam.players.map((p) => ({
                        ...p,
                        id: p.id.replace("home-", "away-"),
                        team: "away",
                        position: { x: p.position.x, y: 600 - p.position.y },
                      })),
                    });
                  }}
                >
                  🔄 チーム入れ替え
                </button>
              </div>
            </div>
          </div>

          {/* 操作説明 */}
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">ℹ️ 操作方法</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled small mb-0">
                <li>🖱️ 選手をドラッグして移動</li>
                <li>🎯 フォーメーションで一括配置</li>
                <li>⚡ 戦術フェーズで配置調整</li>
                <li>💾 データの保存・読み込み</li>
                <li>🔢 背番号/イニシャル切り替え</li>
              </ul>
            </div>
          </div>
        </div>

        {/* メインピッチエリア */}
        <div className="col-lg-9 col-md-8">
          <div className="d-flex justify-content-center">
            <SoccerPitch
              homePlayers={homeTeam.players}
              awayPlayers={awayTeam.players}
              onPlayerDrag={handlePlayerDrag}
              displayMode={displayMode}
              highlightedPlayer={highlightedPlayer}
            />
          </div>

          {/* ピッチ下の情報 */}
          <div className="mt-3">
            <div className="row text-center">
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="badge bg-primary fs-6 p-2 me-2">
                    🏠 {homeTeam.name}
                  </div>
                  <small className="text-muted">⬆️ 攻撃方向</small>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-center">
                  <div className="badge bg-danger fs-6 p-2 me-2">
                    ✈️ {awayTeam.name}
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

      {/* カスタムフォーメーション作成モーダル */}
      <CustomFormationModal
        show={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSave={handleSaveCustomFormation}
        currentPositions={getCurrentPositions(modalTeam)}
        team={modalTeam}
      />
    </div>
  );
};

export default App;
