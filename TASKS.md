# 実装タスク一覧

上から順番に進めること。各フェーズの完了後、簡単に動作確認してから次のフェーズに進む。
詳細仕様は `CLAUDE.md` / `DATA_MODEL.md` / `API.md` を参照。

## Phase 0: プロジェクト初期化

- [x] リポジトリ直下に `frontend/` `backend/` ディレクトリを作成
- [x] `frontend/`: `create-next-app`でTypeScript + App Routerで初期化
- [x] `backend/`: package.json, tsconfig.json を作成し express, prisma, ts-node-dev を導入
- [x] `compose.yml` を配置（内容はリポジトリ直下のものを使用）
- [x] `.env.example` を配置し、`.env` にコピーして値を設定
- [x] `frontend/Dockerfile`, `backend/Dockerfile` を作成
- [x] `docker compose up` で db / backend / frontend の3コンテナが起動することを確認

## Phase 1: DBスキーマ

- [ ] `backend/prisma/schema.prisma` に Customer / Deal / Activity を定義（`DATA_MODEL.md`のスキーマをそのまま使用）
- [ ] `npx prisma migrate dev --name init` でマイグレーション実行
- [ ] Prisma Studio等でテーブルが作成されていることを確認

## Phase 2: バックエンドAPI

- [ ] 認証: `POST /api/auth/login`, `POST /api/auth/logout`
- [ ] 認証middleware（Cookie有無チェックのみ、`backend/src/middleware/auth.ts`）
- [ ] 顧客CRUD: `GET/POST /api/customers`, `GET/PUT/DELETE /api/customers/:id`
  - 詳細取得時は紐づく商談・活動履歴も含めて返す
- [ ] 商談CRUD: `GET/POST /api/deals`, `GET/PUT/DELETE /api/deals/:id`
  - `GET /api/deals?status=` でパイプライン絞り込み
- [ ] 活動履歴CRUD: `GET/POST /api/activities`, `PUT/DELETE /api/activities/:id`
  - `GET /api/activities?customerId=` `?dealId=` で絞り込み
- [ ] ダッシュボード集計: `GET /api/dashboard/summary`
- [ ] 各エンドポイントをcurl等で動作確認

## Phase 3: フロントエンド基盤

- [ ] `frontend/lib/api.ts` にAPIクライアントをまとめる
- [ ] `frontend/middleware.ts` でログインガードを実装（Cookie有無のみ判定）
- [ ] 共通レイアウト・ナビゲーションを作成

## Phase 4: 画面実装

- [ ] ログイン画面（ID入力→Cookie保存→ダッシュボードへ遷移）
- [ ] ダッシュボード（KPIカード＋ステータス別内訳＋直近活動）
- [ ] 顧客一覧（検索付き）
- [ ] 顧客詳細（基本情報＋商談リスト＋活動履歴タイムライン）
- [ ] 商談パイプライン（カンバン、横スクロール、ステータス変更）
- [ ] 商談詳細
- [ ] 活動の追加/編集モーダル

## Phase 5: 仕上げ

- [ ] 一通りの画面遷移を通しで確認（ログイン→ダッシュボード→顧客詳細→商談→活動追加）
- [ ] README.mdに起動手順（`docker compose up`など）を記載
- [ ] 不要なconsole.log・未使用importの削除
