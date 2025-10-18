import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import appRouter from "./routes/route"
import {createUser} from "./controllers/authControllers"
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

createUser()
app.use(appRouter)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
