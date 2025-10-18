import {sensorModel, sensorDataModel} from "../models/sensorModel"
import {prisma} from "../prisma/client"
import {Request, Response} from "express"

export const addSensorData = async (req: Request, res: Response) => {
	try {
		const dataSensor: sensorModel = req.body
		if (
			!dataSensor.curah_hujan ||
			!dataSensor.ketinggian_air ||
			!dataSensor.suhu_udara ||
			!dataSensor.kecepatan_angin
		) {
			return res.status(400).json({message: "Data tidak Lengkap"})
		}

		let status_hujan = ""
		if (dataSensor.curah_hujan > 3 && dataSensor.curah_hujan <= 20) {
			status_hujan = "Hujan Sedang"
		} else if (dataSensor.curah_hujan > 20) {
			status_hujan = "Hujan Lebat"
		} else {
			status_hujan = "Cerah"
		}

		let status_air = ""
		if (dataSensor.ketinggian_air > 5 && dataSensor.ketinggian_air <= 50) {
			status_air = "Siaga"
		} else if (dataSensor.ketinggian_air > 50) {
			status_air = "Bahaya"
		} else {
			status_air = "Aman"
		}

		let status_suhu = ""
		if (dataSensor.suhu_udara > 0 && dataSensor.suhu_udara <= 25) {
			status_suhu = "Suhu Lembap"
		} else if (dataSensor.suhu_udara > 30) {
			status_suhu = "Suhu Panas"
		} else {
			status_suhu = "Suhu Normal"
		}

		let status_angin = ""
		if (dataSensor.kecepatan_angin > 10 && dataSensor.kecepatan_angin <= 15) {
			status_angin = "Angin Sedang"
		} else if (dataSensor.kecepatan_angin > 20) {
			status_angin = "Angin Kencang"
		} else {
			status_angin = "Angin Normal"
		}

		const data: sensorDataModel = {
			curah_hujan: dataSensor.curah_hujan,
			ketinggian_air: dataSensor.ketinggian_air,
			suhu_udara: dataSensor.suhu_udara,
			kecepatan_angin: dataSensor.kecepatan_angin,
			status_air: status_air,
			status_hujan: status_hujan,
			status_suhu: status_suhu,
			status_angin: status_angin,
		}

		const newData = await prisma.sensorData.create({
			data: data,
		})

		const formatdate = new Date(newData.createdAt).toLocaleString("id-ID", {
			dateStyle: "short",
			timeStyle: "medium",
			timeZone: "Asia/Jakarta",
		})

		res.status(201).json({
			success: true,
			message: "Data sensor berhasil disimpan",
			data: {
				...newData,
				createdAt: formatdate,
			},
		})
	} catch (error) {
		res.status(500).json({
			message: "Gagal simpan data sensor",
		})
	}
}

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
