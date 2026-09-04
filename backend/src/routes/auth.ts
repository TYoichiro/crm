import { Router } from "express";
import { AUTH_COOKIE_NAME } from "../middleware/auth";

const router = Router();

router.post("/login", (req, res) => {
  const { id } = req.body ?? {};
  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "id is required" });
  }
  res.cookie(AUTH_COOKIE_NAME, id, { httpOnly: true, sameSite: "lax" });
  res.json({ id });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.status(204).send();
});

export default router;
