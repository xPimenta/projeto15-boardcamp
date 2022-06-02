import { Router } from "express"
import categoryRouter from "./categoryRouter.js"
import gamesRouter from "./gamesRouter.js"
import customersRouter from "./customersRouter.js"
import rentalsRouter from "./rentalsRouter.js"


const router = Router()
router.use(categoryRouter)
router.use(gamesRouter)
router.use(customersRouter)
router.use(rentalsRouter)

export default router