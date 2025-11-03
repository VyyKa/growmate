import Logo from "../assets/Logo.png"
import LoginButton from "./LoginButton"
import AvatarDropdown from "./AvatarDropdown"
import ContactButton from "./ContactButton"
import NavBar from "./NavBar"
import { useAppSelector } from "../hooks/reduxHooks"
import { selectIsLoggedIn } from "../store/slices/authSlice"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const nav = useNavigate()

  return (
    <header>
      <div className="flex items-center justify-between w-full px-3">
        {/* Logo */}
        <div className="pl-5" onClick={() => nav("/")}>
          <img
            src={Logo}
            alt="Quay lại trang chủ"
            className="h-24 w-auto cursor-pointer hover:scale-105 transition-transform duration-300 justify-start"
          />
        </div>

        {/* Contact Button & Login Button or Avatar Dropdown */}
        <div className="flex items-center gap-4">
          <ContactButton />
          {isLoggedIn ? <AvatarDropdown /> : <LoginButton />}
        </div>
      </div>

      {/* Navigation Bar */}
      <div>
        <NavBar />
      </div>
    </header>
  )
}

export default Header
