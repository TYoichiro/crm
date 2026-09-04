import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { requireAuth } from "./middleware/auth";
import authRouter from "./routes/auth";
import customersRouter from "./routes/customers";
import dealsRouter from "./routes/deals";
import activitiesRouter from "./routes/activities";
import dashboardRouter from "./routes/dashboard";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/customers", requireAuth, customersRouter);
app.use("/api/deals", requireAuth, dealsRouter);
app.use("/api/activities", requireAuth, activitiesRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);

app.listen(port, () => {
  console.log(`backend listening on port ${port}`);
});
