import React, { useState, useEffect } from "react";
import Papa from "papaparse";

export interface TeamData {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: string;
  clubColors: string;
  venue: string;
}

interface TeamSelectorProps {
  selectedTeam: TeamData | null;
  onTeamSelect: (team: TeamData | null) => void;
  team: "home" | "away";
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  selectedTeam,
  onTeamSelect,
  team,
}) => {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      // CSVファイルを読み込み
      const response = await fetch("/data/premier_league_teams.csv");

      if (!response.ok) {
        throw new Error(
          `CSVファイルの読み込みに失敗しました: ${response.status}`,
        );
      }

      const csvText = await response.text();

      // PapaParseでCSVを解析
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn("CSV解析警告:", results.errors);
          }

          const teamData = results.data as TeamData[];

          // データの検証とクリーニング
          const validTeams = teamData
            .filter((team) => team.name && team.shortName && team.tla)
            .map((team) => ({
              ...team,
              id: String(team.id),
              name: team.name.trim(),
              shortName: team.shortName.trim(),
              tla: team.tla.trim(),
            }));

          setTeams(validTeams);
          console.log(`✅ ${validTeams.length}チームのデータを読み込みました`);
        },
        error: (error: Error) => {
          throw new Error(`CSV解析エラー: ${error.message}`);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "不明なエラー";
      setError(errorMessage);
      console.error("チームデータ読み込みエラー:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.tla.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleTeamSelect = (teamId: string) => {
    if (teamId === "") {
      onTeamSelect(null);
      return;
    }

    const team = teams.find((t) => t.id === teamId);
    if (team) {
      onTeamSelect(team);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
          チームデータを読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="alert alert-warning mb-3">
            <strong>⚠️ データ読み込みエラー</strong>
            <br />
            {error}
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={loadTeamData}
          >
            🔄 再読み込み
          </button>
          <div className="mt-2">
            <small className="text-muted">
              💡 データファイルが存在しない場合は、
              <code>npm run fetch-teams</code> を実行してください
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h6
          className={`mb-0 ${team === "home" ? "text-primary" : "text-danger"}`}
        >
          🏟️ {team === "home" ? "ホーム" : "アウェイ"}チーム選択
        </h6>
      </div>

      <div className="card-body">
        {/* 検索フィールド */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="チーム名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* チーム選択 */}
        <div className="mb-3">
          <select
            className="form-select form-select-sm"
            value={selectedTeam?.id || ""}
            onChange={(e) => handleTeamSelect(e.target.value)}
          >
            <option value="">-- チームを選択 --</option>
            {filteredTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.tla})
              </option>
            ))}
          </select>
        </div>

        {/* 選択中チーム情報 */}
        {selectedTeam && (
          <div className="card bg-light">
            <div className="card-body p-3">
              <h6 className="card-title mb-2">{selectedTeam.name}</h6>
              <div className="row g-2 small">
                <div className="col-6">
                  <strong>略称:</strong> {selectedTeam.tla}
                </div>
                <div className="col-6">
                  <strong>短縮名:</strong> {selectedTeam.shortName}
                </div>
                {selectedTeam.venue && (
                  <div className="col-12">
                    <strong>本拠地:</strong> {selectedTeam.venue}
                  </div>
                )}
                {selectedTeam.clubColors && (
                  <div className="col-12">
                    <strong>チームカラー:</strong> {selectedTeam.clubColors}
                  </div>
                )}
                {selectedTeam.founded && (
                  <div className="col-12">
                    <strong>創設:</strong> {selectedTeam.founded}年
                  </div>
                )}
              </div>

              <button
                className="btn btn-outline-secondary btn-sm mt-2 w-100"
                onClick={() => onTeamSelect(null)}
              >
                🚫 選択解除
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer">
        <small className="text-muted">
          📊 {teams.length}チームが利用可能
          {searchTerm && ` (${filteredTeams.length}件表示)`}
        </small>
      </div>
    </div>
  );
};

export default TeamSelector;
