import express from "express"
import authRouter from "./authRoute"
import sensorRouter from "./sensorController"
import sensorIdeRouter from "./sensorIde"
import {authMiddleware} from "../middlewares/authMiddleware"

const appRouter = express.Router()

appRouter.use("/api", sensorIdeRouter)
appRouter.use("/api", authRouter)

//harus login dulu
appRouter.use(authMiddleware)
appRouter.use("/api", sensorRouter)

export default appRouter
