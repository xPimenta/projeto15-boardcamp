import express, {json} from "express"
import cors from "cors"
import dotenv from "dotenv"

import router from "./routes/index.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(json())
app.use(router)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is up and running on port ${port}`))