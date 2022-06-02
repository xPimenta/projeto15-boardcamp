import { Router } from "express";
import { deleteRental, getRentals, rent, finish } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalValidator.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals); 
rentalsRouter.post("/rentals", validateRental, rent); 
rentalsRouter.post("/rentals/:id/return", finish);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;