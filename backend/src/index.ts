import express from "express";
import { PrismaClient } from "@prisma/client";
import productsRouter from "./routes/products.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ------------------------------
// Middleware
// ------------------------------
app.use(cors());
app.use(express.json());

//   static files (images) from the uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ------------------------------
// Base route
// ------------------------------
app.get("/", (_, res) => {
    res.json({ message: "Welcome to the Product API" });
});

// Product routes
// ------------------------------
app.use("/products", productsRouter(prisma));

// ------------------------------
// Graceful shutdown
// ------------------------------
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(` Product API running on http://localhost:${port}`);
});
