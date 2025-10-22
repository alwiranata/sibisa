import {useEffect, useState} from "react"
import ExcelJS from "exceljs"
import {saveAs} from "file-saver"

interface SensorData {
	id: number
	curah_hujan: number
	ketinggian_air: number
	suhu_udara: number
	kecepatan_angin: number
	status_hujan: string
	status_air: string
	status_suhu: string
	status_angin: string
	createdAt: string
}

const AllSensor = () => {
	const [data, setData] = useState<SensorData[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token")
				if (!token) {
					alert("Token tidak ditemukan. Silakan login terlebih dahulu.")
					return
				}

				const response = await fetch("http://72.60.236.51:5000/api/sensor", {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				})

				if (!response.ok) throw new Error("Gagal memuat data sensor")

				const result = await response.json()

				// Urutkan dari yang terbaru
				const sorted = result.sort(
					(a: SensorData, b: SensorData) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)

				setData(sorted)
			} catch (error) {
				console.error("Error:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
		const interval = setInterval(fetchData, 1000)
		return () => clearInterval(interval)
	}, [])

	const handleExportExcel = async () => {
		try {
			const token = localStorage.getItem("token")

			if (!token) {
				alert("Token tidak ditemukan. Silakan login terlebih dahulu.")
				return
			}

			const response = await fetch("http://72.60.236.51:5000/api/sensorAll", {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})

			if (response.status === 401) {
				alert("Token tidak valid atau sudah kedaluwarsa. Silakan login ulang.")
				return
			}

			const dataSensorList = await response.json()

			if (!Array.isArray(dataSensorList) || dataSensorList.length === 0) {
				alert("Tidak ada data sensor untuk diekspor.")
				return
			}

			// ✅ Format data biar rapi
			const formattedData = dataSensorList.map((item: SensorData) => ({
				"Curah Hujan (mm)": item.curah_hujan,
				"Ketinggian Air (cm)": item.ketinggian_air,
				"Suhu Udara (°c)": item.suhu_udara,
				"Kecepatan Angin (km/j)": item.kecepatan_angin,
				"Status Curah Hujan": item.status_hujan,
				"Status Air": item.status_air,
				"Status Suhu": item.status_suhu,
				"Status Angin": item.status_angin,
				"Tanggal & Waktu": new Date(item.createdAt).toLocaleString("id-ID", {
					dateStyle: "short",
					timeStyle: "medium",
				}),
			}))

			// ✅ Buat workbook baru
			const workbook = new ExcelJS.Workbook()
			const worksheet = workbook.addWorksheet("Data Sensor")

			// Tambahkan header otomatis dari kunci data
			worksheet.columns = Object.keys(formattedData[0]).map((key) => ({
				header: key,
				key,
				width: 20,
			}))

			// Tambahkan semua data
			formattedData.forEach((item) => worksheet.addRow(item))

			// ✅ Rata tengah semua cell
			worksheet.eachRow((row) => {
				row.eachCell((cell) => {
					cell.alignment = {horizontal: "center", vertical: "middle"}
				})
			})

			// ✅ Header tebal dan background abu-abu
			worksheet.getRow(1).eachCell((cell) => {
				cell.font = {bold: true}
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {argb: "FFD9D9D9"},
				}
			})

			// ✅ Simpan ke file Excel
			const buffer = await workbook.xlsx.writeBuffer()
			saveAs(new Blob([buffer]), "data_sensor.xlsx")

			alert("Data berhasil diekspor ke Excel ")
		} catch (error) {
			console.error("Gagal export Excel:", error)
			alert("Terjadi kesalahan saat export data.")
		}
	}

	if (loading) return <p className='text-center mt-10'>Memuat data sensor...</p>

	// 🧩 Komponen tabel reusable
	const SensorTable = ({
		title,
		field,
		statusField,
		unit,
		colorCondition,
	}: {
		title: string
		field: keyof SensorData
		statusField: keyof SensorData
		unit: string
		colorCondition: (status: string) => string
	}) => {
		const latestFive = data.slice(0, 5) // ✅ ambil hanya 5 data
		return (
			<div className='mb-8'>
				<h2 className='text-xl font-bold mb-2 text-[#2F4752]'>{title}</h2>
				<div className='overflow-x-auto'>
					<table className='min-w-full border border-gray-300 bg-white rounded-lg'>
						<thead className='bg-[#2F4752] text-white text-sm'>
							<tr>
								<th className='px-4 py-2 text-center'>No</th>
								<th className='px-4 py-2 text-center'>Tanggal & Waktu</th>
								<th className='px-4 py-2 text-center'>
									Nilai {title} ({unit})
								</th>
								<th className='px-4 py-2 text-center'>Status</th>
							</tr>
						</thead>
						<tbody>
							{latestFive.length > 0 ? (
								latestFive.map((item, index) => {
									const value = item[field]
									const status = String(item[statusField])

									return (
										<tr
											key={`${title}-${item.id}`}
											className={`text-center text-sm border-t ${
												index % 2 === 0 ? "bg-gray-50" : "bg-white"
											}`}
										>
											<td className='px-3 py-2'>{index + 1}</td>
											<td className='px-3 py-2'>
												{new Date(item.createdAt).toLocaleString("id-ID", {
													dateStyle: "short",
													timeStyle: "medium",
												})}
											</td>
											<td className='px-3 py-2'>{value}</td>
											<td
												className={`px-3 py-2 font-semibold ${colorCondition(
													status
												)}`}
											>
												{status}
											</td>
										</tr>
									)
								})
							) : (
								<tr>
									<td
										colSpan={4}
										className='text-center py-4 text-gray-500'
									>
										Tidak ada data {title.toLowerCase()}.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	return (
		<div className='p-6'>
			<div className=' flex row justify-end mb-10'>
				<img
					className='w-10 h-10'
					src='./excel.jpg'
					alt=''
					onClick={handleExportExcel}
				/>
			</div>
			{/* 🌧️ Curah Hujan */}
			<SensorTable
				title='Curah Hujan'
				field='curah_hujan'
				statusField='status_hujan'
				unit='mm'
				colorCondition={(status) =>
					status === "Hujan Lebat"
						? "text-red-600"
						: status === "Hujan Sedang"
						? "text-blue-600"
						: "text-green-600"
				}
			/>

			{/* 🌊 Ketinggian Air */}
			<SensorTable
				title='Ketinggian Air'
				field='ketinggian_air'
				statusField='status_air'
				unit='cm'
				colorCondition={(status) =>
					status === "Bahaya"
						? "text-red-600"
						: status === "Siaga"
						? "text-yellow-600"
						: "text-green-600"
				}
			/>

			{/* 🌡️ Suhu Udara */}
			<SensorTable
				title='Suhu Udara'
				field='suhu_udara'
				statusField='status_suhu'
				unit='°C'
				colorCondition={
					(status) =>
						status === "Suhu Panas"
							? "text-red-600"
							: status === "Suhu Lembap"
							? "text-blue-600"
							: "text-green-600" // Suhu Normal
				}
			/>

			{/* 💨 Kecepatan Angin */}
			<SensorTable
				title='Kecepatan Angin'
				field='kecepatan_angin'
				statusField='status_angin'
				unit='km/j'
				colorCondition={(status) =>
					status === "Angin Kencang"
						? "text-red-600"
						: status === "Angin Sedang"
						? "text-yellow-600"
						: "text-blue-600"
				}
			/>
		</div>
	)
}

export default AllSensor
