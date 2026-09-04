# データモデル

Customer / Deal / Activity の3エンティティのみ。関係は以下の通り。

- Customer 1 : N Deal
- Customer 1 : N Activity
- Deal 1 : N Activity（Activityは商談に紐づかない場合もある = 任意）

## Prisma スキーマ

`backend/prisma/schema.prisma` にそのまま使用する。

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum DealStatus {
  NEW
  IN_PROGRESS
  WON
  LOST
}

enum ActivityType {
  CALL
  EMAIL
  VISIT
  NOTE
}

model Customer {
  id          String     @id @default(uuid())
  companyName String
  contactName String
  email       String?
  phone       String?
  createdAt   DateTime   @default(now())
  deals       Deal[]
  activities  Activity[]
}

model Deal {
  id                String     @id @default(uuid())
  customerId        String
  customer          Customer   @relation(fields: [customerId], references: [id], onDelete: Cascade)
  title             String
  amount            Int
  status            DealStatus @default(NEW)
  expectedCloseDate DateTime?
  activities        Activity[]
}

model Activity {
  id         String       @id @default(uuid())
  customerId String
  customer   Customer     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  dealId     String?
  deal       Deal?        @relation(fields: [dealId], references: [id], onDelete: SetNull)
  type       ActivityType
  content    String
  createdAt  DateTime     @default(now())
}
```

## フィールド補足

| エンティティ | フィールド | 補足 |
|---|---|---|
| Customer | email, phone | どちらも任意入力 |
| Deal | status | NEW → IN_PROGRESS → WON/LOST の遷移を想定 |
| Deal | amount | 円単位の整数（例: 1200000） |
| Activity | dealId | 商談に紐づかない顧客への活動（雑談メモ等）もあるためnull許容 |
| Activity | type | CALL / EMAIL / VISIT / NOTE の4種 |
| Deal / Activity | customerへの参照 | 顧客削除時にカスケード削除される（`onDelete: Cascade`） |
| Activity | dealへの参照 | 商談削除時は`dealId`が`null`になる（`onDelete: SetNull`）。活動履歴自体は顧客の記録として残る |
