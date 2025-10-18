import {Link} from "react-router-dom"
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

const Dashboard = () => {
	const handleExportExcel = async () => {
		try {
			const token = localStorage.getItem("token")

			if (!token) {
				alert("Token tidak ditemukan. Silakan login terlebih dahulu.")
				return
			}

			const response = await fetch("http://localhost:5000/api/sensor", {
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
				ID: item.id,
				"Curah Hujan (mm)": item.curah_hujan,
				"Ketinggian Air (cm)": item.ketinggian_air,
				"Suhu Udara (°C)": item.suhu_udara,
				"Kecepatan Angin (km/h)": item.kecepatan_angin,
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

	return (
		<div className='flex flex-col'>
			<header className='flex flex-row justify-around mt-[50px] mb-[50px] items-center'>
				<div className='flex flex-col gap-2'>
					<h1 className='text-[#2F4752] font-bold text-2xl'>SIBISA</h1>
					<h3 className='text-[#2F4752]'>
						Sistem Informasi Banjir Sungai Siak
					</h3>
				</div>

				{/* Klik logo untuk export ke Excel */}
				<img
					className='w-[50px] cursor-pointer hover:scale-110 transition-transform'
					src='/sibisa.png'
					alt='Export Excel'
					title='Klik untuk export data ke Excel'
					onClick={handleExportExcel}
				/>
			</header>

			<menu className='flex flex-col items-center justify-between sm:gap-[25px] gap-[55px] mt-6'>
				<Link
					to={"/curah-hujan"}
					className='flex flex-row items-center gap-3 lg:w-[1024px] sm:w-[640px] md:w-[768px] w-[370px] h-[100px] bg-[#2F4752] rounded-2xl'
				>
					<img
						className='w-[60px] h-[60px] rounded-full object-cover p-3'
						src='/curah_hujan.jpg'
						alt='Curah Hujan'
					/>
					<p className='text-white text-[20px] font-medium'>Curah Hujan</p>
				</Link>

				<Link
					to={"/ketinggian-air"}
					className='flex flex-row items-center gap-3 lg:w-[1024px] sm:w-[640px] md:w-[768px] w-[370px] h-[100px] bg-[#2F4752] rounded-2xl'
				>
					<img
						className='w-[60px] h-[60px] rounded-full object-cover p-3'
						src='/ketinggian_air.jpg'
						alt='Ketinggian Air'
					/>
					<p className='text-white text-[20px] font-medium'>Ketinggian Air</p>
				</Link>

				<Link
					to={"/suhu-udara"}
					className='flex flex-row items-center gap-3 lg:w-[1024px] sm:w-[640px] md:w-[768px] w-[370px] h-[100px] bg-[#2F4752] rounded-2xl'
				>
					<img
						className='w-[60px] h-[60px] rounded-full object-cover p-3'
						src='/suhu_udara.jpg'
						alt='Suhu Udara'
					/>
					<p className='text-white text-[20px] font-medium'>Suhu Udara</p>
				</Link>

				<Link
					to={"/kecepatan-angin"}
					className='flex flex-row items-center gap-3 lg:w-[1024px] sm:w-[640px] md:w-[768px] w-[370px] h-[100px] bg-[#2F4752] rounded-2xl'
				>
					<img
						className='w-[60px] h-[60px] rounded-full object-cover p-3'
						src='/kecepatan_angin.jpg'
						alt='Kecepatan Angin'
					/>
					<p className='text-white text-[20px] font-medium'>Kecepatan Angin</p>
				</Link>

				<Link
					to={"/all"}
					className='flex flex-row items-center gap-3 lg:w-[1024px] sm:w-[640px] md:w-[768px] w-[370px] h-[100px] bg-[#2F4752] rounded-2xl'
				>
					<img
						className='w-[60px] h-[60px] rounded-full object-cover p-3'
						src='/excel.jpg'
						alt='Kecepatan Angin'
					/>
					<p className='text-white text-[20px] font-medium'>Informasi</p>
				</Link>
			</menu>
		</div>
	)
}

export default Dashboard
