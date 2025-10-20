import {prisma} from "../prisma/client"
import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {userLoginModel} from "../models/authModel"

const JWT_SECRET = process.env.JWT_SECRET || "sibisa_secret_key"

// Login
export const Login = async (req: Request, res: Response) => {
	try {
		const userLogin: userLoginModel = req.body

		const user = await prisma.user.findUnique({
			where: {username: userLogin.username},
		})
		if (!user) {
			return res.status(404).json({message: "username tidak ditemukan"})
		}
		const pass = await bcrypt.compare(userLogin.password, user.password)
		if (!pass) {
			return res.status(400).json({message: "password salah"})
		}

		const token = jwt.sign(
			{id: user.id, username: user.username},
			JWT_SECRET // ← tidak ada expiresIn di sini
		)

		res.json({
			message: "Login berhasil",
			token: token,
		})
	} catch (error) {
		res.status(500).json({message: "terjadi kesalahan pada server"})
	}
}

//Create User
export const createUser = async () => {
	try {
		const username = "admin"
		const password = "sibisa2025"

		const existingUser = await prisma.user.findUnique({
			where: {username},
		})
		if (existingUser) {
			return
		}

		const hashed = await bcrypt.hash(password, 10)
		await prisma.user.create({
			data: {
				username: username,
				password: hashed,
			},
		})
		console.log(" User admin berhasil dibuat")
	} catch (error) {
		console.error(" Gagal membuat user:", error)
	}
}
