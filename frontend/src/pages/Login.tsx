import {useState} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"

const Login = () => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const response = await axios.post("http://localhost:5000/api/login", {
				username,
				password,
			})

			const {token} = response.data

			// Simpan token ke localStorage
			localStorage.setItem("token", token)

			alert("Login berhasil!")
			navigate("/dashboard") // pindah ke halaman dashboard
		} catch (error) {
            alert("Login gagal! Periksa username dan password Anda.")
			console.error("Login error:", error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<div className='bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-sm'>
				<div className='flex flex-col items-center mb-6'>
					<img
						src='/sibisa.png'
						alt='Sibisa Logo'
						className='w-[100px] mb-2'
					/>
					
				</div>

				<form
					onSubmit={handleSubmit}
					className='flex flex-col gap-4'
				>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
					/>

					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
					/>

					<button
						type='submit'
						disabled={loading}
						className='bg-[#2F4752] text-white rounded-lg py-2 font-medium hover:bg-blue-800 transition-all disabled:bg-gray-400'
					>
						{loading ? "Loading..." : "Login"}
					</button>
				</form>
			</div>
		</div>
	)
}

export default Login
