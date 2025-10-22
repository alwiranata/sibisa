import {prisma} from "../prisma/client"
import {Request, Response} from "express"


export const getSensorData = async (req: Request, res: Response) => {
	try {
		const data = await prisma.sensorData.findMany({
			orderBy: {createdAt: "desc"},
			take: 10,
		})
		res.json(data)
	} catch (error) {
		res.status(500).json({
			message: "Gagal mengambil data sensor",
		})
	}
}

// Untuk export Excel (ambil semua data)
export const getAllSensorData = async (req: Request, res: Response) => {
	try {
		const data = await prisma.sensorData.findMany({
			orderBy: { createdAt: "desc" },
		})
		res.json(data)
	} catch (error) {
		res.status(500).json({ message: "Gagal mengambil semua data sensor" })
	}
}
