import express from "express"
import {addSensorData} from "../controllers/sensorController"
const sensorIdeRouter = express.Router()

sensorIdeRouter.post("/sensorIde", addSensorData)

export default sensorIdeRouter
