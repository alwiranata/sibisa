import express from "express"
import authRouter from "./authRoute"
import sensorRouter from "./sensorController"
import sensorIdeRouter from "./sensorIde"
import {authMiddleware} from "../middlewares/authMiddleware"

const appRouter = express.Router()

appRouter.use("/api", authRouter)
appRouter.use("/api", sensorIdeRouter)
appRouter.use("/api", sensorRouter, authMiddleware)

export default appRouter
