import express from "express";
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../db/queries/employees.js";

const router = express.Router();

//accept ONLY positive integers as IDs
function isNonNegativeIntegerString(id) {
  return /^\d+$/.test(id);
}

//Required fields for POST or Put
function hasRequiredFields(body) {
  if (!body) return false;

  const hasName = typeof body.name === "string" && body.name.trim() !== "";
  const hasBirthday =
    typeof body.birthday === "string" && body.birthday.trim() !== "";
  const hasSalary = typeof body.salary === "number";

  return hasName && hasBirthday && hasSalary;
}

// GET employees(all employees)
router.get("/", async (req, res, next) => {
  try {
    const employees = await getEmployees();
    res.send(employees);
  } catch (err) {
    next(err);
  }
});

//POST employees (create employee)
router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is required");
    }

    if (!hasRequiredFields(req.body)) {
      return res.status(400).send("Missing required field(s)");
    }

    const newEmployee = await createEmployee({
      name: req.body.name.trim(),
      birthday: req.body.birthday,
      salary: req.body.salary,
    });

    res.status(201).send(newEmployee);
  } catch (err) {
    next(err);
  }
});

//gET /employees/:id (get employee by id)
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isNonNegativeIntegerString(id)) {
      return res.status(400).send("ID must be a non-negative integer");
    }

    const employee = await getEmployee(Number(id));
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.send(employee);
  } catch (err) {
    next(err);
  }
});

//DELETE /employees/:id (delete by id)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isNonNegativeIntegerString(id)) {
      return res.status(400).send("ID must be a non-negative integer");
    }

    const deleted = await deleteEmployee(Number(id));
    if (!deleted) {
      return res.status(404).send("Employee not found");
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

//PUT /employees/:id (update by id)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).send("Request body is required");
    }

    if (!hasRequiredFields(req.body)) {
      return res.status(400).send("Missing required field(s)");
    }

    if (!isNonNegativeIntegerString(id)) {
      return res.status(400).send("ID must be a non-negative integer");
    }

    const updated = await updateEmployee({
      id: Number(id),
      name: req.body.name.trim(),
      birthday: req.body.birthday,
      salary: req.body.salary,
    });

    if (!updated) {
      return res.status(404).send("Employee not found");
    }

    res.status(200).send(updated);
  } catch (err) {
    next(err);
  }
});

export default router;


