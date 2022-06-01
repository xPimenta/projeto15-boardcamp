import { Router } from "express"
import categoryRouter from "./categoryRouter.js"
import customersRouter from "./customersRouter.js"


const router = Router()
router.use(categoryRouter)
router.use(gamesRouter)


export default router