import {prisma} from "../prisma/client"
import {Request, Response} from "express"


export const getSensorData = async (req: Request, res: Response) => {
	try {
		const data = await prisma.sensorData.findMany({
			orderBy: {createdAt: "desc"},
			take: 20,
		})
		res.json(data)
	} catch (error) {
		res.status(500).json({
			message: "Gagal mengambil data sensor",
		})
	}
}
