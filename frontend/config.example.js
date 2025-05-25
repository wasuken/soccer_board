// API設定ファイルのサンプル
// このファイルをconfig.jsにコピーして、実際のAPIキーを設定してください

export const API_CONFIG = {
  // Football-Data.org APIキー
  // https://www.football-data.org/client/register で取得
  FOOTBALL_DATA_API_KEY: "YOUR_API_KEY_HERE",

  // API設定
  API_BASE_URL: "https://api.football-data.org/v4",
  PREMIER_LEAGUE_ID: 2021,

  // リクエスト設定
  REQUEST_DELAY: 1000, // APIリクエスト間の待機時間（ミリ秒）
  MAX_RETRIES: 3, // 最大リトライ回数
  RATE_LIMIT_DELAY: 60000, // レート制限時の待機時間（ミリ秒）
};
