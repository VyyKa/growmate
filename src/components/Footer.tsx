import Logo from "../assets/Logo.png"

const Footer = () => {
  const exploreLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Cửa hàng", path: "/shop" },
    { name: "Nhận nuôi", path: "/adopt" },
    { name: "Tin tức", path: "/news" },
    { name: "Liên hệ", path: "/contact" },
    { name: "Chính sách và điều khoản", path: "/policy" },
  ]

  const contactInfo = [
    { icon: "📞", text: "0941430391" },
    { icon: "✉️", text: "growmate.work@gmail.com" },
    {
      icon: "📍",
      text: "FPT UNIVERSITY - Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức",
    },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Slogan Section */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={Logo} alt="GrowMate Logo" className="h-20 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              "From Small Garden to
              <br />
              Fresh Fruit Basket"
            </p>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Khám Phá</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6.8291 17.0806C13.9002 21.3232 19.557 15.6663 18.8499 5.0598C8.24352 4.35269 2.58692 10.0097 6.8291 17.0806ZM6.8291 17.0806C6.82902 17.0805 6.82918 17.0807 6.8291 17.0806ZM6.8291 17.0806L5 18.909M6.8291 17.0806L10.6569 13.2522" />
                    </svg>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liên Hệ</h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div
                  className="flex items-center text-gray-400 text-sm"
                  key={index}
                >
                  <span className="text-yellow-400 mr-2">{info.icon}</span>
                  {info.text}
                </div>
              ))}
            </div>

            {/* Email Subscription */}
            <div className="mt-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
                <button className="bg-main hover:bg-green-500 px-4 py-2 rounded-r-lg transition-colors duration-300 cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-gray-500 text-xs text-center">
            © All Copyright 2025 by HERO TEAM - FPT UNIVERSITY
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
