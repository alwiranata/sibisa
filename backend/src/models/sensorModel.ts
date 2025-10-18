export type sensorModel = {
	curah_hujan: number
	ketinggian_air: number
	suhu_udara: number
	kecepatan_angin: number
}

export type sensorDataModel = {
	curah_hujan: number
	ketinggian_air: number
	suhu_udara: number
	kecepatan_angin: number
	status_hujan: string
	status_air: string
	status_suhu: string
	status_angin: string
	createdAt?: Date
}
