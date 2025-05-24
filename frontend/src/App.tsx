import React, { useState, useEffect } from "react";
import SoccerPitch from "./components/SoccerPitch";
import FormationSelector from "./components/FormationSelector";
import { Player, Team, Formation } from "./types";
import { PRESET_FORMATIONS, getFormationById } from "./data/formations";

const App: React.FC = () => {
  const [displayMode, setDisplayMode] = useState<"number" | "initial">(
    "number",
  );

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
    const formation = getFormationById(formationId);
    if (!formation) return;

    if (team === "home") {
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

  // データの保存・読み込み
  const saveToLocalStorage = () => {
    const data = {
      homeTeam,
      awayTeam,
      displayMode,
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
          <FormationSelector
            selectedFormation={PRESET_FORMATIONS[0].id}
            onFormationChange={(formationId) =>
              handleFormationChange("home", formationId)
            }
            team="home"
            currentPhase={homeTeam.currentPhase}
            onPhaseChange={(phase) => handlePhaseChange("home", phase)}
          />

          <FormationSelector
            selectedFormation={PRESET_FORMATIONS[0].id}
            onFormationChange={(formationId) =>
              handleFormationChange("away", formationId)
            }
            team="away"
            currentPhase={awayTeam.currentPhase}
            onPhaseChange={(phase) => handlePhaseChange("away", phase)}
          />

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
            />
          </div>

          {/* ピッチ下の情報 */}
          <div className="mt-3 text-center">
            <div className="row">
              <div className="col-6">
                <div className="badge bg-primary fs-6 p-2">
                  🏠 {homeTeam.name}
                </div>
              </div>
              <div className="col-6">
                <div className="badge bg-danger fs-6 p-2">
                  ✈️ {awayTeam.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
