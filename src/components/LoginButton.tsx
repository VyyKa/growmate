import { useNavigate } from "react-router-dom"

const LoginButton = () => {
  const nav = useNavigate()

  return (
    <button
      className="font-medium rounded-3xl bg-main shadow-md p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer text-white"
      onClick={() => nav("/login")}
    >
      Đăng nhập/Đăng ký
    </button>
  )
}

export default LoginButton
