import { Router } from "express";
import { createCustomer, getCustomer, getCustomers, updateCustomer } from "../controllers/customerController.js";
import { validateCustomer } from "../middlewares/customerValidator.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", validateCustomer, createCustomer);
customersRouter.put("/customers", validateCustomer, updateCustomer);

export default customersRouter;