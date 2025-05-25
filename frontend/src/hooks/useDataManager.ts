import { useState, useRef } from "react";
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

  // メモリ内でのデータ保存状態
  const [savedData, setSavedData] = useState<SaveData | null>(null);
  const [saveHistory, setSaveHistory] = useState<SaveData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // データの保存（メモリ内）
  const saveToMemory = () => {
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

      setSavedData(data);
      setSaveHistory((prev) => [data, ...prev.slice(0, 4)]); // 最新5件まで保持
      alert("データをメモリに保存しました");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("データの保存に失敗しました");
    }
  };

  // データの読み込み（メモリから）
  const loadFromMemory = () => {
    try {
      if (!savedData) {
        alert("保存されたデータがありません");
        return;
      }

      // データの復元
      setHomeTeam(savedData.homeTeam);
      setAwayTeam(savedData.awayTeam);
      setDisplayMode(savedData.displayMode || "number");
      setCustomFormations(savedData.customFormations || []);
      setHomeSelectedFormation(
        savedData.homeSelectedFormation || PRESET_FORMATIONS[0].id,
      );
      setAwaySelectedFormation(
        savedData.awaySelectedFormation || PRESET_FORMATIONS[0].id,
      );
      setSelectedHomeTeamData(savedData.selectedHomeTeamData || null);
      setSelectedAwayTeamData(savedData.selectedAwayTeamData || null);

      alert("データを読み込みました");
    } catch (error) {
      console.error("読み込みエラー:", error);
      alert("データの読み込みに失敗しました");
    }
  };

  // 履歴から読み込み
  const loadFromHistory = (data: SaveData) => {
    try {
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

      alert("履歴データを読み込みました");
    } catch (error) {
      console.error("履歴読み込みエラー:", error);
      alert("履歴データの読み込みに失敗しました");
    }
  };

  // データのリセット
  const resetData = () => {
    if (
      confirm("すべてのデータをリセットしますか？この操作は取り消せません。")
    ) {
      setSavedData(null);
      setSaveHistory([]);
      alert("データをリセットしました。ページを再読み込みしてください。");
      window.location.reload();
    }
  };

  // データのエクスポート（JSONファイルとしてダウンロード）
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
      alert("データをJSONファイルとしてダウンロードしました");
    } catch (error) {
      console.error("エクスポートエラー:", error);
      alert("データのエクスポートに失敗しました");
    }
  };

  // データのインポート（JSONファイルから）
  const importData = () => {
    // ファイル選択ダイアログを開く
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    // ファイル入力をリセット
    event.target.value = "";
  };

  // クイックスナップショット（現在の状態を一時保存）
  const createSnapshot = () => {
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

    setSaveHistory((prev) => [data, ...prev.slice(0, 9)]); // 最新10件まで保持
    alert("スナップショットを作成しました");
  };

  return {
    // メモリベースの保存・読み込み
    saveToLocalStorage: saveToMemory,
    loadFromLocalStorage: loadFromMemory,

    // 新機能
    resetData,
    exportData,
    importData,
    createSnapshot,
    loadFromHistory,

    // 状態
    savedData,
    saveHistory,
    hasSavedData: savedData !== null,

    // ファイル入力用のref
    fileInputRef,
    handleFileSelect,
  };
};
