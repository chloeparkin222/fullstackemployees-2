import express from "express";
const app = express();
export default app;
import employeesRouter from "./api/employees.js";

app.use(express.json());

//GET 
app.get("/", (req, res) => {
  res.send("Welcome to the Fullstack Employees API.");
});

//MOUNT router
app.use("/employees", employeesRouter);

// catch all errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});


