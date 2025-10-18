import type { ReactElement } from "react"
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom"
import SensorKetinggianAir from "../pages/SensorKetinggianAir"
import SensorSuhu from "../pages/SensorSuhu"
import SensorAngin from "../pages/SensorAngin"
import SensorCurahHujan from "../pages/SensorCurahHujan"
import SigIn from "../pages/Sigin"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import NotFound from "../pages/NotFound"
import AllSensor from "../pages/AllSensor"

// 🔒 Komponen proteksi login langsung di sini
const PrivateRoute = ({children}: {children: ReactElement}) => {
	const token = localStorage.getItem("token")
	return token ? (
		children
	) : (
		<Navigate
			to='/login'
			replace
		/>
	)
}

const AppRoute = () => {
	return (
		<Router>
			<Routes>
				{/* Halaman bebas diakses */}
				<Route
					path='/'
					element={<SigIn />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>

				{/* Halaman hanya untuk user login */}
				<Route
					path='/dashboard'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path='/ketinggian-air'
					element={
						<PrivateRoute>
							<SensorKetinggianAir />
						</PrivateRoute>
					}
				/>
				<Route
					path='/suhu-udara'
					element={
						<PrivateRoute>
							<SensorSuhu />
						</PrivateRoute>
					}
				/>
				<Route
					path='/kecepatan-angin'
					element={
						<PrivateRoute>
							<SensorAngin />
						</PrivateRoute>
					}
				/>
				<Route
					path='/curah-hujan'
					element={
						<PrivateRoute>
							<SensorCurahHujan />
						</PrivateRoute>
					}
				/>
				<Route
					path='/all'
					element={
						<PrivateRoute>
							<AllSensor />
						</PrivateRoute>
					}
				/>

				{/* Fallback */}
				<Route
					path='*'
					element={<NotFound />}
				/>
			</Routes>
		</Router>
	)
}

export default AppRoute
