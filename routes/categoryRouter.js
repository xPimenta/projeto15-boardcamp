import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { validateCategory } from "../middlewares/categoryValidator.js";


const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.post("/categories", validateCategory, createCategory);

export default categoryRouter;