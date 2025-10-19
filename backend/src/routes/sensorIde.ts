import express from "express"
import {addSensorData, getSensorData} from "../controllers/sensorController"
const sensorIdeRouter = express.Router()

sensorIdeRouter.post("/sensor", addSensorData)

export default sensorIdeRouter
