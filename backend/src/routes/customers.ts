import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { companyName: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
  res.json(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: { deals: true, activities: true },
  });
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json(customer);
});

router.post("/", async (req, res) => {
  const { companyName, contactName, email, phone } = req.body ?? {};
  if (!companyName || !contactName) {
    return res.status(400).json({ error: "companyName and contactName are required" });
  }
  const customer = await prisma.customer.create({
    data: { companyName, contactName, email, phone },
  });
  res.status(201).json(customer);
});

router.put("/:id", async (req, res) => {
  const { companyName, contactName, email, phone } = req.body ?? {};
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: { companyName, contactName, email, phone },
    });
    res.json(customer);
  } catch {
    res.status(404).json({ error: "Customer not found" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Customer not found" });
  }
});

export default router;
