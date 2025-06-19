import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

async function initDb() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing database", error);
    process.exit(1);
  }
}

app.post("/api/transactions", async (req, res, next) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transaction =
      await sql`INSERT INTO transactions(user_id, title, amount, category) VALUES(${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;
    console.log(transaction);
    res.status(201).json(transaction);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("", (req, res) => {
  res.send("Hello from the backend");
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
  });
});
