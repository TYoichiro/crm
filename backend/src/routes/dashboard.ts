import { Router } from "express";
import { DealStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/summary", async (_req, res) => {
  const [dealCount, amountAgg, statusGroups, recentActivities] = await Promise.all([
    prisma.deal.count(),
    prisma.deal.aggregate({ _sum: { amount: true } }),
    prisma.deal.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.activity.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const statusBreakdown: Record<DealStatus, number> = {
    NEW: 0,
    IN_PROGRESS: 0,
    WON: 0,
    LOST: 0,
  };
  for (const group of statusGroups) {
    statusBreakdown[group.status] = group._count.status;
  }

  res.json({
    dealCount,
    totalAmount: amountAgg._sum.amount ?? 0,
    statusBreakdown,
    recentActivities,
  });
});

export default router;
