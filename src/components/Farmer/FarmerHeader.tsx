import Logo from "../../assets/Logo.png"
import AvatarDropdown from "../AvatarDropdown"
import FarmerNavBar from "./FarmerNavBar"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, TreePine } from "lucide-react"

const FarmerHeader = () => {
  const nav = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        {/* Top bar with Logo and Avatar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div onClick={() => nav("/farmer")} className="cursor-pointer">
            <img
              src={Logo}
              alt="Farmer Dashboard"
              className="h-20 w-auto hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Navigation and Avatar combined */}
          <div className="flex items-center gap-8">
            <FarmerNavBar />
            <AvatarDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}

export default FarmerHeader

export { LayoutDashboard, TreePine }
