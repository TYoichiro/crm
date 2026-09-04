# API仕様

REST + JSON。ベースパスは `/api`。認証はCookieベース（実チェックなし、Phase 2参照）。

## 認証

| メソッド | パス | 内容 |
|---|---|---|
| POST | /api/auth/login | body: `{ id: string }` を受け取りCookie発行（値の検証はしない） |
| POST | /api/auth/logout | Cookie削除 |

## 顧客 (Customer)

| メソッド | パス | 内容 |
|---|---|---|
| GET | /api/customers | 一覧。`?q=` で会社名・担当者名を部分一致検索 |
| GET | /api/customers/:id | 詳細。紐づく `deals` と `activities` を含めて返す |
| POST | /api/customers | 新規作成 |
| PUT | /api/customers/:id | 更新 |
| DELETE | /api/customers/:id | 削除 |

## 商談 (Deal)

| メソッド | パス | 内容 |
|---|---|---|
| GET | /api/deals | 一覧。`?status=` でパイプライン絞り込み（NEW/IN_PROGRESS/WON/LOST） |
| GET | /api/deals/:id | 詳細 |
| POST | /api/deals | 新規作成 |
| PUT | /api/deals/:id | 更新。カンバンでのステータス変更もこのエンドポイントを使う |
| DELETE | /api/deals/:id | 削除 |

## 活動履歴 (Activity)

| メソッド | パス | 内容 |
|---|---|---|
| GET | /api/activities | 一覧。`?customerId=` または `?dealId=` で絞り込み |
| POST | /api/activities | 新規作成 |
| PUT | /api/activities/:id | 更新 |
| DELETE | /api/activities/:id | 削除 |

## ダッシュボード

| メソッド | パス | 内容 |
|---|---|---|
| GET | /api/dashboard/summary | 商談件数・金額合計・ステータス別内訳・直近活動をまとめて返す |

### `/api/dashboard/summary` レスポンス例

```json
{
  "dealCount": 18,
  "totalAmount": 8400000,
  "statusBreakdown": {
    "NEW": 5,
    "IN_PROGRESS": 8,
    "WON": 3,
    "LOST": 2
  },
  "recentActivities": [
    { "id": "...", "type": "CALL", "content": "田中商事へ電話", "createdAt": "..." }
  ]
}
```

## 設計方針

顧客詳細は毎回関連テーブルをフロント側で個別取得させず、`GET /api/customers/:id` にネストして含めることで、フロント側のAPI呼び出し回数を減らす。
