import { Router } from "express";
import { getCategories } from "../controllers/categoryController.js";


const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);

export default categoryRouter;