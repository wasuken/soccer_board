# チームデータ取得機能

## 🎯 概要

プレミアリーグのチーム情報を自動取得してCSV形式で保存し、アプリケーションで利用できる機能です。

## 📋 セットアップ手順

### 1. APIキーの取得

1. [Football-Data.org](https://www.football-data.org/client/register) でアカウント作成
2. 無料APIキーを取得（月間100リクエスト制限）
3. `scripts/fetchTeamData.js` の `YOUR_API_KEY_HERE` を実際のキーに置き換え

### 2. チームデータの取得

```bash
# Dockerコンテナ内で実行
docker exec -it <container_name> npm run fetch-teams

# または直接Node.jsで実行
node scripts/fetchTeamData.js
```

### 3. ファイル配置確認

実行後、以下のファイルが作成されます：

```
public/data/premier_league_teams.csv
```

## 📊 取得されるデータ
