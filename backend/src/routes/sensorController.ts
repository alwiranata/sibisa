import express from "express"
import {getSensorData, getAllSensorData} from "../controllers/sensorController"
const sensorRouter = express.Router()

sensorRouter.get("/sensor", getSensorData)
sensorRouter.get("/sensorAll", getAllSensorData)

export default sensorRouter
