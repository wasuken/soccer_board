FROM node:18-alpine

WORKDIR /app

# package.jsonをコピーして依存関係をインストール
COPY ./frontend/package*.json ./
RUN npm install

# アプリケーションのソースをコピー
COPY ./frontend/ .

# ポート5173を公開
EXPOSE 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
