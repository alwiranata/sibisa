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

	// ✅ Ambil 5 data terbaru untuk tampilan
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
				setData(result.slice(0, 5)) // hanya ambil 5 data terbaru
			} catch (error) {
				console.error("Error saat ambil data:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
		const interval = setInterval(fetchData, 2000)
		return () => clearInterval(interval)
	}, [])

	// ✅ Export semua data ke Excel
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

			if (!response.ok) throw new Error("Gagal mengambil semua data sensor")

			const allData = await response.json()

			if (!Array.isArray(allData) || allData.length === 0) {
				alert("Tidak ada data sensor untuk diekspor.")
				return
			}

			const formattedData = allData.map((item: SensorData) => ({
				"Curah Hujan (mm)": item.curah_hujan,
				"Status Curah Hujan": item.status_hujan,
				"Ketinggian Air (cm)": item.ketinggian_air,
				"Status Air": item.status_air,
				"Suhu Udara (°C)": item.suhu_udara,
				"Status Suhu": item.status_suhu,
				"Kecepatan Angin (km/j)": item.kecepatan_angin,
				"Status Angin": item.status_angin,
				"Tanggal & Waktu": new Date(item.createdAt).toLocaleString("id-ID", {
					dateStyle: "short",
					timeStyle: "medium",
				}),
			}))

			const workbook = new ExcelJS.Workbook()
			const worksheet = workbook.addWorksheet("Data Sensor")

			worksheet.columns = Object.keys(formattedData[0]).map((key) => ({
				header: key,
				key,
				width: 20,
			}))

			formattedData.forEach((item) => worksheet.addRow(item))

			worksheet.eachRow((row) => {
				row.eachCell((cell) => {
					cell.alignment = {horizontal: "center", vertical: "middle"}
				})
			})

			worksheet.getRow(1).eachCell((cell) => {
				cell.font = {bold: true}
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: {argb: "FFD9D9D9"},
				}
			})

			const buffer = await workbook.xlsx.writeBuffer()
			saveAs(new Blob([buffer]), "data_sensor.xlsx")

			alert("✅ Data berhasil diekspor ke Excel!")
		} catch (error) {
			console.error("Gagal export data ke Excel:", error)
			alert("Terjadi kesalahan saat export data.")
		}
	}

	if (loading) return <p className='text-center mt-10'>Memuat data sensor...</p>

	// ✅ Komponen reusable untuk tabel tiap sensor
	const SensorTable = ({
		title,
		valueKey,
		statusKey,
		unit,
		colorCondition,
	}: {
		title: string
		valueKey: keyof SensorData
		statusKey: keyof SensorData
		unit: string
		colorCondition: (status: string) => string
	}) => (
		<div className='mb-10'>
			<h2 className='text-xl font-bold mb-3 text-[#2F4752]'>{title}</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full border border-gray-300 bg-white rounded-lg'>
					<thead className='bg-[#2F4752] text-white text-sm'>
						<tr>
							<th className='px-4 py-2 text-center'>No</th>
							<th className='px-4 py-2 text-center'>Tanggal & Waktu</th>
							<th className='px-4 py-2 text-center'>Nilai ({unit})</th>
							<th className='px-4 py-2 text-center'>Status</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((item, index) => {
								const status = String(item[statusKey])
								return (
									<tr
										key={`${title}-${item.id}`}
										className={`text-center border-t ${
											index % 2 === 0 ? "bg-gray-50" : "bg-white"
										}`}
									>
										<td className='py-2'>{index + 1}</td>
										<td className='py-2'>
											{new Date(item.createdAt).toLocaleString("id-ID", {
												dateStyle: "short",
												timeStyle: "medium",
											})}
										</td>
										<td className='py-2'>{item[valueKey]}</td>
										<td
											className={`py-2 font-semibold ${colorCondition(status)}`}
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
									className='text-center py-3 text-gray-500'
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

	// ✅ Render empat sensor
	return (
		<div className='p-6'>
			<div className='flex row justify-end mb-10'>
				<img
					className='w-10 h-10 cursor-pointer'
					src='./excel.jpg'
					alt='Export ke Excel'
					onClick={handleExportExcel}
				/>
			</div>

			{/* 🌧️ Curah Hujan */}
			<SensorTable
				title='Curah Hujan'
				valueKey='curah_hujan'
				statusKey='status_hujan'
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
				valueKey='ketinggian_air'
				statusKey='status_air'
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
				valueKey='suhu_udara'
				statusKey='status_suhu'
				unit='°C'
				colorCondition={(status) =>
					status === "Suhu Panas"
						? "text-red-600"
						: status === "Suhu Lembap"
						? "text-blue-600"
						: "text-green-600"
				}
			/>

			{/* 💨 Kecepatan Angin */}
			<SensorTable
				title='Kecepatan Angin'
				valueKey='kecepatan_angin'
				statusKey='status_angin'
				unit='km/j'
				colorCondition={(status) =>
					status === "Kencang"
						? "text-red-600"
						: status === "Sedang"
						? "text-yellow-600"
						: "text-green-600"
				}
			/>
		</div>
	)
}

export default AllSensor
