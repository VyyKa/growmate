import { useNavigate } from "react-router-dom"

const AuthBanner = () => {
  const navigate = useNavigate()

  const handleButtonClick = () => {
    navigate("/login")
  }

  return (
    <div className={`bg-green-700 py-8 px-4 `}>
      <div className="container mx-auto text-center">
        {/* Main title */}
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-6 max-w-6xl mx-auto leading-tight">
          CÙNG GROWMATE TẠO NÊN NHỮNG ĐIỀU KỲ DIỆU NGAY HÔM NAY!
        </h2>

        <button
          onClick={handleButtonClick}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
        >
          Đăng ký miễn phí hoặc Đăng nhập
        </button>
      </div>
    </div>
  )
}

export default AuthBanner
