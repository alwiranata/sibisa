import express from "express"
import authRouter from "./authRoute"
import sensorRouter from "./sensorController"
import {authMiddleware} from "../middlewares/authMiddleware"

const appRouter = express.Router()

appRouter.use("/api", authRouter)

//harus login dulu
appRouter.use(authMiddleware)

appRouter.use("/api", sensorRouter)

export default appRouter
