import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "sibisa_secret_key"

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Ambil token dari header Authorization
		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({message: "Token tidak ditemukan"})
		}

		const token = authHeader.split(" ")[1]

		// Verifikasi token
		const decoded = jwt.verify(token, JWT_SECRET)
		;(req as any).user = decoded // simpan info user ke request

		next() // lanjut ke route berikutnya
	} catch (error) {
		return res
			.status(401)
			.json({message: "Token tidak valid atau sudah kedaluwarsa"})
	}
}
