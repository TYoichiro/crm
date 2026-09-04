# CRM（練習用ミニマル構成）プロジェクト概要

このファイルはClaude Codeがこのリポジトリで作業する際の前提知識です。実装を始める前に必ず読むこと。

## プロジェクトの位置づけ

会社でCRMを構築する前段階として、個人の練習用に作成するミニマルなCRM Webアプリケーション。
本番運用は想定していない。実装イメージを掴むための練習プロジェクト。**過剰な作り込みはしないこと。**

## スコープ

以下の4つに限定する。範囲を勝手に広げない。

- 顧客管理
- 商談/案件管理
- 活動履歴管理
- ダッシュボード（サマリー表示）

## 技術スタック

| 領域 | 技術 |
|---|---|
| フロントエンド | Next.js (App Router) + TypeScript |
| バックエンド | Node.js + Express + TypeScript |
| DB | PostgreSQL |
| ORM | Prisma |
| 実行環境 | Docker Compose（db / backend / frontend の3コンテナ） |

## 認証方針（重要）

本格的な認証は実装しない。個人が一人で使うことのみを想定した簡易ログイン。

- ログイン画面でID（名前など任意の文字列）を入力させる
- パスワードチェックは行わない
- 入力されたIDをそのままCookieに保存する
- Middlewareでは「Cookieが存在するかどうか」だけを確認し、なければ `/login` にリダイレクトする
- 将来的に本格認証へ差し替える前提で、認証ロジックは以下の2ファイルに閉じ込める
  - `backend/src/middleware/auth.ts`
  - `frontend/proxy.ts`（Next.js 16で`middleware`規約が`proxy`に名称変更されたため。役割はNext.jsのミドルウェアと同じ）

## ディレクトリ構成

```
crm-app/                       # このリポジトリのルート
├── frontend/                 # Next.js
│   ├── app/
│   │   ├── login/             # ログイン画面（認証ガード対象外）
│   │   └── (app)/              # ログイン必須画面をまとめるルートグループ（URLには影響しない）
│   │       ├── dashboard/
│   │       ├── customers/
│   │       │   ├── page.tsx       # 一覧
│   │       │   └── [id]/page.tsx  # 詳細（商談＋活動履歴）
│   │       ├── deals/page.tsx     # パイプライン
│   │       └── layout.tsx         # 共通ナビゲーション
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── CustomerCard.tsx
│   │   ├── DealCard.tsx
│   │   └── ActivityTimeline.tsx
│   ├── lib/api.ts             # backend呼び出しの集約
│   ├── proxy.ts               # ログインガード（Next.js 16の`middleware`規約の後継）
│   ├── Dockerfile
│   └── package.json
│
├── backend/                   # Express + Prisma
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── customers.ts
│   │   │   ├── deals.ts
│   │   │   ├── activities.ts
│   │   │   └── dashboard.ts
│   │   ├── middleware/auth.ts
│   │   ├── lib/prisma.ts
│   │   └── index.ts
│   ├── prisma/schema.prisma
│   ├── Dockerfile
│   └── package.json
│
├── compose.yml
├── .env.example
├── CLAUDE.md
├── TASKS.md
├── DATA_MODEL.md
└── API.md
```

## データモデル

詳細は `DATA_MODEL.md` を参照。Customer / Deal / Activity の3エンティティのみ。

## API仕様

詳細は `API.md` を参照。REST + JSON、CRUD中心。

## 画面一覧

1. ログイン（ID入力のみ）
2. ダッシュボード（商談件数・金額合計・ステータス別内訳・直近活動）
3. 顧客一覧
4. 顧客詳細（基本情報＋商談リスト＋活動履歴タイムライン）
5. 商談パイプライン（カンバン、ステータス列を横スクロール）
6. 商談詳細
7. 活動の追加/編集（モーダル）

## 実装の進め方

`TASKS.md` の順番（Phase 0 → Phase 5）に沿って実装すること。フェーズを飛ばさない。各フェーズ完了後は簡単に動作確認してから次に進む。

## コーディング規約

- TypeScript strict mode を有効にする
- コンポーネントは関数コンポーネント + Hooks
- API呼び出しは `frontend/lib/api.ts` に集約し、コンポーネント内で直接fetchしない
- 命名: コンポーネントはPascalCase、それ以外のファイルはキャメルケース
- テストコードは今回のスコープ外（練習用のため不要）
- コメントは必要最小限。自明なコードにコメントは書かない
