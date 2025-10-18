import {useEffect} from "react"
import {useNavigate} from "react-router-dom"

const SigIn = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/login")
		}, 2000)
		return () => clearTimeout(timer)
	}, [navigate])

	return (
		<div className='flex items-center justify-center h-screen '>
			<div className='flex  gap-3 items-center '>
				<img
					className='w-[200px] '
					src='/sibisa.png'
					alt=''
				/>
				
			</div>
		</div>
	)
}
export default SigIn
