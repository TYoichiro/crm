# crm

CRM（練習用ミニマル構成）プロジェクト

詳細な仕様は以下を参照。

- [CLAUDE.md](./CLAUDE.md): プロジェクト概要・技術スタック・認証方針
- [DATA_MODEL.md](./DATA_MODEL.md): データモデル
- [API.md](./API.md): API仕様
- [TASKS.md](./TASKS.md): 実装タスク一覧（進行状況）

## 技術スタック

- フロントエンド: Next.js (App Router) + TypeScript
- バックエンド: Node.js + Express + TypeScript
- DB: PostgreSQL + Prisma
- 実行環境: Docker Compose（db / backend / frontend）

## セットアップ

```bash
cp .env.example .env
docker compose up -d

# 初回のみ: DBマイグレーションを適用
docker compose exec backend npx prisma migrate deploy
```

起動後、以下にアクセスできる。

- フロントエンド: http://localhost:8010（`/login` からIDを入力してログイン）
- バックエンド: http://localhost:8011 （動作確認: `GET /health`）
- DB (Postgres): localhost:8000

## 進行状況

全フェーズ（Phase 0〜5）完了。詳細は [TASKS.md](./TASKS.md) を参照。
