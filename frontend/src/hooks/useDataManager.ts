import { Team, Formation } from "../types";
import { TeamData } from "../components/TeamSelector";
import { PRESET_FORMATIONS } from "../data/formations";

interface SaveData {
  homeTeam: Team;
  awayTeam: Team;
  displayMode: "number" | "initial";
  customFormations: Formation[];
  homeSelectedFormation: string;
  awaySelectedFormation: string;
  selectedHomeTeamData: TeamData | null;
  selectedAwayTeamData: TeamData | null;
  timestamp: string;
}

interface DataManagerParams {
  homeTeam: Team;
  awayTeam: Team;
  displayMode: "number" | "initial";
  customFormations: Formation[];
  homeSelectedFormation: string;
  awaySelectedFormation: string;
  selectedHomeTeamData: TeamData | null;
  selectedAwayTeamData: TeamData | null;
  setHomeTeam: (team: Team) => void;
  setAwayTeam: (team: Team) => void;
  setDisplayMode: (mode: "number" | "initial") => void;
  setCustomFormations: (formations: Formation[]) => void;
  setHomeSelectedFormation: (id: string) => void;
  setAwaySelectedFormation: (id: string) => void;
  setSelectedHomeTeamData: (data: TeamData | null) => void;
  setSelectedAwayTeamData: (data: TeamData | null) => void;
}

export const useDataManager = (params: DataManagerParams) => {
  const {
    homeTeam,
    awayTeam,
    displayMode,
    customFormations,
    homeSelectedFormation,
    awaySelectedFormation,
    selectedHomeTeamData,
    selectedAwayTeamData,
    setHomeTeam,
    setAwayTeam,
    setDisplayMode,
    setCustomFormations,
    setHomeSelectedFormation,
    setAwaySelectedFormation,
    setSelectedHomeTeamData,
    setSelectedAwayTeamData,
  } = params;

  // データの保存
  const saveToLocalStorage = () => {
    try {
      const data: SaveData = {
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
    } catch (error) {
      console.error("保存エラー:", error);
      alert("データの保存に失敗しました");
    }
  };

  // データの読み込み
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("soccerTacticalBoard");
      if (!saved) {
        alert("保存されたデータがありません");
        return;
      }

      const data: SaveData = JSON.parse(saved);

      // データの復元
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
      console.error("読み込みエラー:", error);
      alert("データの読み込みに失敗しました");
    }
  };

  // データのリセット
  const resetData = () => {
    if (
      confirm("すべてのデータをリセットしますか？この操作は取り消せません。")
    ) {
      localStorage.removeItem("soccerTacticalBoard");
      // 初期状態への復元は呼び出し元で行う
      alert("データをリセットしました。ページを再読み込みしてください。");
      window.location.reload();
    }
  };

  // データのエクスポート
  const exportData = () => {
    try {
      const data: SaveData = {
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

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `soccer-tactical-board-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("エクスポートエラー:", error);
      alert("データのエクスポートに失敗しました");
    }
  };

  // データのインポート
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: SaveData = JSON.parse(e.target?.result as string);

        // データの復元
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

        alert("データをインポートしました");
      } catch (error) {
        console.error("インポートエラー:", error);
        alert(
          "データのインポートに失敗しました。ファイル形式を確認してください。",
        );
      }
    };
    reader.readAsText(file);
  };

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    resetData,
    exportData,
    importData,
  };
};
