import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

import transactionsRoutes from "./routes/transactionsRoutes.js";
import { initDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.use(rateLimiter);
app.use(express.json());

app.use("/api/health", (req, res) => res.status(200).json({ status: "OK" }));

app.use("/api/transactions", transactionsRoutes);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});
