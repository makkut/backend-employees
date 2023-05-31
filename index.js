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

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const usersFilePath = path.join(__dirname, "db", "employees.json");
// let users = loadUsers();

// function loadUsers() {
//   try {
//     const data = fs.readFileSync(usersFilePath);
//     return JSON.parse(data);
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }

// function saveUsers() {
//   try {
//     const data = JSON.stringify(users);
//     fs.writeFileSync(usersFilePath, data);
//   } catch (err) {
//     console.error(err);
//   }
// }

app.get("/api/employees", (req, res) => {
  res.json(users);
});

// app.get("/api/employees/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const user = users.find((u) => u.id === id);
//   if (!user) {
//     res.status(404).send("User not found");
//     return;
//   }
//   res.json(user);
// });

// app.post("/api/employees", (req, res) => {
//   const user = req.body;
//   if (users.length !== 0) {
//     let maxId = users.reduce((acc, curr) => (acc.id > curr.id ? acc : curr));
//     user.id = maxId.id + 1;
//   } else {
//     user.id = 1;
//   }
//   users.push(user);
//   saveUsers();
//   res.json(user);
// });

// app.put("/api/employees/:id", (req, res) => {
//   const id = req.params.id;
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].id == id) {
//       users[i] = req.body;
//       users[i].id = Number(id);
//       saveUsers();
//       res.json(users[i]);
//       return;
//     }
//   }
//   res.status(404).json({ error: "Employee not found" });
// });

// app.delete("/api/employees/:id", (req, res) => {
//   const id = req.params.id;
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].id == id) {
//       users.splice(i, 1);
//       saveUsers();
//       res.sendStatus(204);
//       return;
//     }
//   }
//   res.status(404).json({ error: "Employee not found" });
// });

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

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
