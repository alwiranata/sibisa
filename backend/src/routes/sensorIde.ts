import express from "express"
import { addSensorDataIde } from "../controllers/sensorIdeController"
const sensorIdeRouter = express.Router()

sensorIdeRouter.post("/sensorIde", addSensorDataIde)

export default sensorIdeRouter
