import express from "express"
import authRouter from "./authRoute"
import sensorRouter from "./sensorController"
import sensorIdeRouter from "./sensorIde"
import {authMiddleware} from "../middlewares/authMiddleware"

const appRouter = express.Router()

appRouter.use("/api", authRouter)
appRouter.use("/api", sensorIdeRouter)

//harus login dulu
appRouter.use(authMiddleware)

appRouter.use("/api", sensorRouter)

export default appRouter
