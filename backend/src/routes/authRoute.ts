import express from "express"
import {Login} from "../controllers/authControllers"
const authRouter = express.Router()

authRouter.post("/login", Login)

export default authRouter
