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
				setData(result)
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
				"Ketinggian Air (cm)": item.ketinggian_air,
				"Suhu Udara (°C)": item.suhu_udara,
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

	// ✅ Fungsi warna status
	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "normal":
				return "bg-green-100 text-green-700 font-semibold"
			case "siaga":
				return "bg-yellow-100 text-yellow-700 font-semibold"
			case "bahaya":
				return "bg-red-100 text-red-700 font-semibold"
			default:
				return "bg-gray-100 text-gray-600"
		}
	}

	// ✅ Komponen tabel dengan status
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

			<h2 className='text-xl font-bold mb-4 text-[#2F4752]'>
				5 Data Sensor Terbaru
			</h2>

			<div className='overflow-x-auto'>
				<table className='min-w-full border border-gray-300 bg-white rounded-lg text-sm'>
					<thead className='bg-[#2F4752] text-white'>
						<tr>
							<th className='px-4 py-2'>No</th>
							<th className='px-4 py-2'>Curah Hujan (mm)</th>
							<th className='px-4 py-2'>Status Hujan</th>
							<th className='px-4 py-2'>Ketinggian Air (cm)</th>
							<th className='px-4 py-2'>Status Air</th>
							<th className='px-4 py-2'>Suhu Udara (°C)</th>
							<th className='px-4 py-2'>Status Suhu</th>
							<th className='px-4 py-2'>Kecepatan Angin (km/j)</th>
							<th className='px-4 py-2'>Status Angin</th>
							<th className='px-4 py-2'>Tanggal & Waktu</th>
						</tr>
					</thead>
					<tbody>
						{data.length > 0 ? (
							data.map((item, index) => (
								<tr
									key={item.id}
									className={`text-center border-t ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									}`}
								>
									<td className='py-2'>{index + 1}</td>
									<td>{item.curah_hujan}</td>
									<td>
										<span
											className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
												item.status_hujan
											)}`}
										>
											{item.status_hujan}
										</span>
									</td>
									<td>{item.ketinggian_air}</td>
									<td>
										<span
											className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
												item.status_air
											)}`}
										>
											{item.status_air}
										</span>
									</td>
									<td>{item.suhu_udara}</td>
									<td>
										<span
											className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
												item.status_suhu
											)}`}
										>
											{item.status_suhu}
										</span>
									</td>
									<td>{item.kecepatan_angin}</td>
									<td>
										<span
											className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
												item.status_angin
											)}`}
										>
											{item.status_angin}
										</span>
									</td>
									<td>
										{new Date(item.createdAt).toLocaleString("id-ID", {
											dateStyle: "short",
											timeStyle: "medium",
										})}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={10}
									className='text-center py-4 text-gray-500'
								>
									Tidak ada data sensor.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AllSensor
