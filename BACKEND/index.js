import express from "express";
import authRoute from "./routes/authRoutes.js";
import aiRoute from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoute);
app.use('/api/ai' , aiRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
