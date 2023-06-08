import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

dotenv.config();
const PORT = 3001;
const corsOptions = {
  credentials: true,
  origin: process.env.CLIENT_URL,
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
app.get("/api/employees", (req, res) => {
  res.json(users);
});
app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () =>
      console.log(chalk.green(`Server has been started on port ${PORT}`))
    );
  } catch (e) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }
}

start();
