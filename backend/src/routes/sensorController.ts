import express from "express"
import {getSensorData} from "../controllers/sensorController"
const sensorRouter = express.Router()

sensorRouter.get("/sensor", getSensorData)

export default sensorRouter
