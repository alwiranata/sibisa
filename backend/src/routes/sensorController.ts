import express from "express"
import {addSensorData, getSensorData} from "../controllers/sensorController"
const sensorRouter = express.Router()

sensorRouter.get("/sensor", getSensorData)
sensorRouter.post("/sensor", addSensorData)
sensorRouter.post("/sensorIde", addSensorData)

export default sensorRouter
