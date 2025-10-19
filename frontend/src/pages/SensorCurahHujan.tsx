import {useEffect, useState} from "react"
import {Line} from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js"
import type {ChartOptions} from "chart.js"

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

// ✅ Tipe data sesuai backend
interface SensorData {
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

const SensorCurahHujan = () => {
	const [sensorData, setSensorData] = useState<SensorData[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token")
				const res = await fetch("http://72.60.236.51:5000/api/sensor", {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				})
				const json = await res.json()
				if (Array.isArray(json)) {
					setSensorData(json)
				} else {
					console.error("Data bukan array:", json)
				}
			} catch (err) {
				console.error("Gagal ambil data sensor:", err)
			}
		}

		fetchData()
		const interval = setInterval(fetchData, 5000)
		return () => clearInterval(interval)
	}, [])

	// ✅ Ambil hanya 10 data terbaru dan urutkan dari lama ke baru
	const limitedData = [...sensorData]
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)
		.slice(0, 10)
		.reverse()

	// ✅ Data terakhir yang muncul di chart (sinkron)
	const latestData = limitedData[limitedData.length - 1] || null

	// Label waktu dari data sensor (dari lama ke baru)
	const labels = limitedData.map((item) => {
		const waktu = new Date(item.createdAt)
		return waktu.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
		})
	})

	// Dataset Curah Hujan
	const data = {
		labels,
		datasets: [
			{
				label: "Curah Hujan (mm)",
				data: limitedData.map((item) => item.curah_hujan),
				fill: false,
				borderColor: "rgb(75, 192, 192)",
				tension: 0.3,
				pointRadius: 5,
			},
		],
	}

	const options: ChartOptions<"line"> = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
		},
		scales: {
			x: {title: {display: true, text: "Waktu"}},
			y: {title: {display: true, text: "Curah Hujan (mm)"}},
		},
	}

	return (
		<div className='flex flex-col'>
			<header className='flex flex-row justify-around mt-[50px] mb-[101px]'>
				<div className='flex flex-col justify-center w-[239px] gap-2'>
					<h1 className='text-[#2F4752] font-bold'>Curah Hujan</h1>
				</div>
				<img
					className='w-[50px]'
					src='/curah_hujan.jpg'
					alt='Curah Hujan'
				/>
			</header>

			{/* Chart */}
			<div className='flex justify-center lg:h-screen mb-[59px]'>
				<Line
					data={data}
					options={options}
				/>
			</div>

			{/* Info kotak */}
			<div className='flex flex-row justify-around'>
				<div className='flex flex-col gap-[26px]'>
					{/* Tanggal */}
					<div className='flex flex-col items-center justify-center bg-[#2F4752] rounded-2xl w-[137px] h-[100px]'>
						<h1 className='font-bold text-white'>Tanggal</h1>
						<p className='m-2 w-[90%] h-full bg-white text-[#2F4752] rounded-[8px] text-center flex justify-center items-center'>
							{latestData
								? new Date(latestData.createdAt).toLocaleDateString("id-ID")
								: "—"}
						</p>
					</div>

					{/* Waktu */}
					<div className='flex flex-col items-center justify-center bg-[#2F4752] rounded-2xl w-[137px] h-[100px]'>
						<h1 className='font-bold text-white'>Waktu</h1>
						<p className='m-2 w-[90%] h-full bg-white text-[#2F4752] rounded-[8px] text-center flex justify-center items-center'>
							{latestData
								? new Date(latestData.createdAt).toLocaleTimeString("id-ID", {
										hour: "2-digit",
										minute: "2-digit",
								  })
								: "—"}
						</p>
					</div>

					{/* Curah */}
					<div className='flex flex-col items-center justify-center bg-[#2F4752] rounded-2xl w-[137px] h-[100px]'>
						<h1 className='font-bold text-white'>Curah</h1>
						<p className='m-2 w-[90%] h-full bg-white text-[#2F4752] rounded-[8px] text-center flex justify-center items-center'>
							{latestData ? `${latestData.curah_hujan} mm/j` : "—"}
						</p>
					</div>
				</div>

				{/* Status */}
				<div className='flex flex-col items-center justify-center rounded-2xl h-[352px] w-[175px] bg-[#2F4752]'>
					<h1 className='font-bold h-[40%] text-white flex justify-center items-center'>
						Status
					</h1>
					<p
						className={`m-2 w-[90%] h-full bg-white  rounded-[8px] text-center flex justify-center items-center font-black ${
							latestData?.status_hujan === "Hujan Lebat"
								? "text-red-600"
								: latestData?.status_hujan === "Hujan Sedang"
								? "text-blue-600"
								: "text-green-600"
						}
`}
					>
						{latestData ? latestData.status_hujan : "—"}
					</p>
				</div>
			</div>
		</div>
	)
}

export default SensorCurahHujan
