import { Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

const TrialButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/trial")}
      className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-main text-main font-semibold bg-white shadow hover:bg-main hover:text-white transition-all duration-200"
    >
      <Sparkles size={18} />
      Dùng thử
    </button>
  )
}

export default TrialButton

