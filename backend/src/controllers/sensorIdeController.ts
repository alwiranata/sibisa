import {sensorModel, sensorDataModel} from "../models/sensorModel"
import {prisma} from "../prisma/client"
import {Request, Response} from "express"

export const addSensorDataIde = async (req: Request, res: Response) => {
	try {
		const dataSensor: sensorModel = req.body
		if (
			dataSensor.curah_hujan == null ||
			dataSensor.ketinggian_air == null ||
			dataSensor.suhu_udara == null ||
			dataSensor.kecepatan_angin == null
		) {
			return res.status(400).json({message: "Data tidak Lengkap"})
		}

		let status_hujan = ""
		if (dataSensor.curah_hujan <= 0 && dataSensor.curah_hujan <= 3) {
			status_hujan = "Cerah"
		} else if (dataSensor.curah_hujan <= 4 && dataSensor.curah_hujan <= 15) {
			status_hujan = "Hujan Sedang"
		} else {
			status_hujan = "Hujan Lebat"
		}

		let status_air = ""
		if (dataSensor.ketinggian_air > 80) {
			status_air = "Normal"
		} else if (
			dataSensor.ketinggian_air > 50 &&
			dataSensor.ketinggian_air <= 80
		) {
			status_air = "Siaga"
		} else if (dataSensor.ketinggian_air <= 50) {
			status_air = "Bahaya"
		}

		let status_suhu = ""
		if (dataSensor.suhu_udara < 25) {
			status_suhu = "Lembap"
		} else if (dataSensor.suhu_udara >= 25 && dataSensor.suhu_udara <= 30) {
			status_suhu = "Normal"
		} else {
			status_suhu = "Panas"
		}

		let kecepatan_angin = 0
		let status_angin = ""

		if (status_suhu === "Lembap") {
			kecepatan_angin = 10
			status_angin = "Angin Pelan"
		} else if (status_suhu === "Normal") {
			kecepatan_angin = 25
			status_angin = "Angin Sedang"
		} else if (status_suhu === "Panas") {
			kecepatan_angin = 40
			status_angin = "Angin Kencang"
		}

		const data: sensorDataModel = {
			curah_hujan: dataSensor.curah_hujan,
			ketinggian_air: dataSensor.ketinggian_air,
			suhu_udara: dataSensor.suhu_udara,
			kecepatan_angin: kecepatan_angin,
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
