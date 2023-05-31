import express from "express";
import { EmployeesModel } from "../models/employees.model.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const list = await EmployeesModel.find();
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({ message: "Sever error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeesModel.findById(id);
    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).json({ message: "Employees not found" });
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const employee = new EmployeesModel(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updatedEmployee = await EmployeesModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      res.send(updatedEmployee);
    } catch (error) {
      res.status(404).json({ message: "Employees not found" });
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const employee = await EmployeesModel.findById(id);
      employee.deleteOne();
      res.status(200).send({ message: "Employee deleted" });
    } catch (error) {
      res.status(404).json({ message: "Employees not found" });
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;
