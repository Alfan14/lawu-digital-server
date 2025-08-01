import express from "express";
import cors from "cors";
import multer from 'multer';
import dotenv from 'dotenv';
import { createServer } from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import path from "path";
import helmet from "helmet";
import bodyParser from "body-parser";

import adminRoutes from "./routes/adminRoute.mjs";
import cloudinaryController from "./controllers/cloudinaryControllers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;
const app = express();

const allowedOrigins = [process.env.PROD_ORIGIN, process.env.ORIGIN].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/admin/', adminRoutes);

app.use('/api/', cloudinaryController);


app.get("/", (req, res) => {
  console.log("Halo kamu sampai default Route");
  res.send("This is the default Server Route");
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});