import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";
import mongoose from "mongoose";
import routes from "./routes/index.js";

dotenv.config();
const PORT = 3001;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

app.get("/api/employees", (req, res) => {
  res.json(users);
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () =>
      console.log(chalk.green(`Server has been started on port ${PORT}`))
    );
  } catch (e) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }
}

start();
