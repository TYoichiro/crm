import { Router } from "express";
import { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();

const VALID_TYPES = Object.values(ActivityType);

function isActivityType(value: unknown): value is ActivityType {
  return typeof value === "string" && (VALID_TYPES as string[]).includes(value);
}

router.get("/", async (req, res) => {
  const { customerId, dealId } = req.query;
  const where: Prisma.ActivityWhereInput = {};
  if (typeof customerId === "string") where.customerId = customerId;
  if (typeof dealId === "string") where.dealId = dealId;

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json(activities);
});

router.post("/", async (req, res) => {
  const { customerId, dealId, type, content } = req.body ?? {};
  if (!customerId || !isActivityType(type) || !content) {
    return res.status(400).json({ error: "customerId, type and content are required" });
  }
  try {
    const activity = await prisma.activity.create({
      data: { customerId, dealId: dealId ?? undefined, type, content },
    });
    res.status(201).json(activity);
  } catch {
    res.status(400).json({ error: "Invalid customerId or dealId" });
  }
});

router.put("/:id", async (req, res) => {
  const { dealId, type, content } = req.body ?? {};
  try {
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: {
        dealId,
        type: isActivityType(type) ? type : undefined,
        content,
      },
    });
    res.json(activity);
  } catch {
    res.status(404).json({ error: "Activity not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.activity.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Activity not found" });
  }
});

export default router;
