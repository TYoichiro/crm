import { Router } from "express";
import { DealStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

const router = Router();

const VALID_STATUSES = Object.values(DealStatus);

function isDealStatus(value: unknown): value is DealStatus {
  return typeof value === "string" && (VALID_STATUSES as string[]).includes(value);
}

router.get("/", async (req, res) => {
  const status = req.query.status;
  const deals = await prisma.deal.findMany({
    where: isDealStatus(status) ? { status } : undefined,
    include: { customer: true },
  });
  res.json(deals);
});

router.get("/:id", async (req, res) => {
  const deal = await prisma.deal.findUnique({
    where: { id: req.params.id },
    include: { customer: true, activities: true },
  });
  if (!deal) {
    return res.status(404).json({ error: "Deal not found" });
  }
  res.json(deal);
});

router.post("/", async (req, res) => {
  const { customerId, title, amount, status, expectedCloseDate } = req.body ?? {};
  if (!customerId || !title || typeof amount !== "number") {
    return res.status(400).json({ error: "customerId, title and amount are required" });
  }
  try {
    const deal = await prisma.deal.create({
      data: {
        customerId,
        title,
        amount,
        status: isDealStatus(status) ? status : undefined,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : undefined,
      },
    });
    res.status(201).json(deal);
  } catch {
    res.status(400).json({ error: "Invalid customerId" });
  }
});

router.put("/:id", async (req, res) => {
  const { customerId, title, amount, status, expectedCloseDate } = req.body ?? {};
  try {
    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data: {
        customerId,
        title,
        amount,
        status: isDealStatus(status) ? status : undefined,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : undefined,
      },
    });
    res.json(deal);
  } catch {
    res.status(404).json({ error: "Deal not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.deal.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Deal not found" });
  }
});

export default router;
