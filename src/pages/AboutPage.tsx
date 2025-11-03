import { useState } from "react"
import Logo from "../assets/Logo.png"
import { useNavigate } from "react-router-dom"
import TrangImg from "../assets/imgs/about-Trang.jpg"
import KhoaImg from "../assets/imgs/about-Khoa.jpg"
import QuangImg from "../assets/imgs/about-Quang.jpg"
import DatImg from "../assets/imgs/about-Dat.jpg"
import KhaImg from "../assets/imgs/homeFeedback2.png"
import MissionImg from "../assets/imgs/about-misson.png"
import VisionImg from "../assets/imgs/about-vison.png"
import { AimIconSvg } from "../assets/svgs/AimIconSvg"
import LeafIconSvg from "../assets/svgs/LeafIconSvg"
import ArrowRightIconSvg from "../assets/svgs/ArrowRightIconSvg"

const AboutPage = () => {
  const navigate = useNavigate()

  const [activeValue, setActiveValue] = useState<number | null>(null)

  const stats = [
    { number: "500+", label: "Nông dân đối tác", icon: "👨‍🌾" },
    { number: "10K+", label: "Cây được nhận nuôi", icon: "🌳" },
    { number: "98%", label: "Khách hàng hài lòng", icon: "😊" },
    { number: "50+", label: "Vườn trái cây", icon: "🏞️" },
  ]

  const timeline = [
    {
      year: "2024",
      event: "Khởi nguồn từ FPT University",
      desc: "Ý tưởng được thai nghén trong khóa học khởi nghiệp",
    },
    {
      year: "2024",
      event: "Phát triển MVP",
      desc: "Xây dựng phiên bản thử nghiệm đầu tiên",
    },
    {
      year: "2025",
      event: "Ra mắt chính thức",
      desc: "Triển khai nền tảng với đầy đủ tính năng",
    },
    {
      year: "Tương lai",
      event: "Mở rộng Đông Nam Á",
      desc: "Kế hoạch phát triển ra khu vực",
    },
  ]

  const team = [
    {
      name: "Hồ Tài Liên Vy Kha",
      role: "CEO",
      desc: "Trưởng nhóm & Hỗ trợ kỹ thuật",
      color: "green",
      icon: KhaImg,
      bgGradient: "from-green-100 to-green-200",
      textColor: "text-green-600",
    },
    {
      name: "Vũ Hà Trang",
      role: "CFO",
      desc: "Kế hoạch tiếp thị & Nghiên cứu thị trường",
      color: "blue",
      icon: TrangImg,
      bgGradient: "from-blue-100 to-blue-200",
      textColor: "text-blue-600",
    },
    {
      name: "Nguyễn Minh Quang",
      role: "CTO",
      desc: "Backend & Database",
      color: "orange",
      icon: QuangImg,
      bgGradient: "from-orange-100 to-orange-200",
      textColor: "text-orange-600",
    },
    {
      name: "Trương Đình Khoa",
      role: "CPO",
      desc: "UI/UX Design",
      color: "pink",
      icon: KhoaImg,
      bgGradient: "from-pink-100 to-pink-200",
      textColor: "text-pink-600",
    },
    {
      name: "Lê Tiến Đạt",
      role: "COO",
      desc: "Frontend & Database",
      color: "indigo",
      icon: DatImg,
      bgGradient: "from-indigo-100 to-indigo-200",
      textColor: "text-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animated Hero Section */}
      <div className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multi-layer Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>

          {/* Animated Blobs */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-multiply filter blur-2xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${
                    [
                      "#10b981",
                      "#059669",
                      "#0d9488",
                      "#14b8a6",
                      "#06b6d4",
                      "#0ea5e9",
                      "#10b981",
                      "#059669",
                    ][i]
                  } 0%, transparent 70%)`,
                  width: `${300 + i * 50}px`,
                  height: `${300 + i * 50}px`,
                  left: `${(i * 15) % 100}%`,
                  top: `${(i * 20) % 100}%`,
                  animation: `float ${15 + i * 3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-green-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${
                    10 + Math.random() * 20
                  }s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  transform: `translateY(${scrollY * 0.3}px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto py-16 sm:py-20">
          {/* Animated Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-white via-white to-green-50/50 backdrop-blur-md rounded-full mb-8 shadow-2xl border-2 border-green-100/50 relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <img
              src={Logo}
              alt="Animated Icon"
              className="relative z-10 w-2xl h-2xl sm:w-16 sm:h-16 md:w-20 md:h-20"
            />
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-pulse"></div>
          </div>

          {/* Title with reveal animation */}
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 tracking-tight text-balance animate-fadeIn">
              <span
                className="inline-block opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "0.1s",
                  animationFillMode: "forwards",
                }}
              >
                Chúng
              </span>{" "}
              <span
                className="inline-block opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "0.2s",
                  animationFillMode: "forwards",
                }}
              >
                Tôi
              </span>{" "}
              <span
                className="inline-block opacity-0 animate-fadeIn"
                style={{
                  animationDelay: "0.3s",
                  animationFillMode: "forwards",
                }}
              >
                Là
              </span>
            </h1>
            <div
              className="relative inline-block opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
            >
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 tracking-tighter">
                GrowMate
              </h2>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 blur-2xl opacity-30 -z-10"></div>
            </div>
          </div>

          {/* Subtitle with typing effect */}
          <p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12 font-light px-4 text-pretty opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            Tiên phong trong việc kết nối con người với thiên nhiên thông qua
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              {" "}
              nông nghiệp số
            </span>
          </p>

          {/* Enhanced Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-green-100/50 hover:border-green-300/50 opacity-0 animate-fadeIn"
                style={{
                  animationDelay: `${0.9 + index * 0.15}s`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:to-emerald-400/10 rounded-2xl transition-all duration-500"></div>

                {/* Icon */}
                <div className="text-4xl sm:text-5xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative z-10">
                  {stat.icon}
                </div>

                {/* Number */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-700 group-hover:from-green-600 group-hover:to-emerald-600 mb-2 transition-all duration-500 relative z-10">
                  {stat.number}
                </div>

                {/* Label */}
                <div className="text-sm sm:text-base text-gray-600 group-hover:text-gray-900 font-medium transition-colors duration-300 relative z-10">
                  {stat.label}
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400/20 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </div>

      {/* Story Section with Parallax */}
      <section className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-200/30 rounded-full blur-3xl hidden lg:block"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 hover:shadow-3xl transition-shadow duration-500">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    📖
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-balance">
                    Câu Chuyện Của
                    <span className="text-green-600"> Chúng Tôi</span>
                  </h2>

                  <div className="space-y-3 sm:space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                    <p className="text-pretty">
                      Bắt đầu từ một ý tưởng đơn giản trong lớp học tại{" "}
                      <span className="font-semibold text-blue-600">
                        FPT University
                      </span>
                      , GrowMate đã phát triển thành một sứ mệnh lớn lao hơn.
                    </p>
                    <p className="text-pretty">
                      Chúng tôi nhận ra khoảng cách giữa người tiêu dùng thành
                      thị và nông sản sạch, cùng với những khó khăn mà nông dân
                      gặp phải trong việc tiếp cận thị trường.
                    </p>
                    <p className="font-semibold text-green-700 text-pretty">
                      GrowMate ra đời để là cầu nối, mang lại giá trị cho cả hai
                      phía thông qua công nghệ và tình yêu với thiên nhiên.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-emerald-600"></div>
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex items-center mb-8 group"
                  >
                    <div className="absolute left-6 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 bg-white border-3 sm:border-4 border-green-500 rounded-full transform -translate-x-1/2 group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="ml-14 sm:ml-20 bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:translate-x-2 transition-all duration-300">
                      <div className="text-green-600 font-bold text-xs sm:text-sm mb-1">
                        {item.year}
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {item.event}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Core Values */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4 text-balance">
              Giá Trị <span className="text-green-600">Cốt Lõi HERO</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 text-pretty">
              "Empowering People, Building Legacy" - Triết lý dẫn đường cho mọi
              hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                letter: "H",
                color: "red",
                title: "Have the Courage",
                desc: "Làm điều đúng đắn",
                icon: "💪",
                fullDesc:
                  "Chúng tôi luôn đặt tính minh bạch và sự chính trực lên hàng đầu trong mọi hoạt động",
                bgGradient: "from-red-50 to-red-100",
                borderColor: "border-red-200",
                iconGradient: "from-red-400 to-red-600",
                textColor: "text-red-800",
                hoverBg: "from-red-500 to-red-600",
              },
              {
                letter: "E",
                color: "blue",
                title: "Empower Others",
                desc: "Trao quyền cho mọi người",
                icon: "🚀",
                fullDesc:
                  "Tạo điều kiện để nông dân và người dùng phát triển tốt nhất khả năng của mình",
                bgGradient: "from-blue-50 to-blue-100",
                borderColor: "border-blue-200",
                iconGradient: "from-blue-400 to-blue-600",
                textColor: "text-blue-800",
                hoverBg: "from-blue-500 to-blue-600",
              },
              {
                letter: "R",
                color: "green",
                title: "Resilience",
                desc: "Kiên cường vượt khó",
                icon: "🛡️",
                fullDesc:
                  "Không ngừng học hỏi và cải thiện để vượt qua mọi thách thức",
                bgGradient: "from-green-50 to-green-100",
                borderColor: "border-green-200",
                iconGradient: "from-green-400 to-green-600",
                textColor: "text-green-800",
                hoverBg: "from-green-500 to-green-600",
              },
              {
                letter: "O",
                color: "purple",
                title: "Own the Impact",
                desc: "Tạo tác động tích cực",
                icon: "🎯",
                fullDesc:
                  "Cam kết tạo ra tác động tích cực và lâu dài cho cộng đồng",
                bgGradient: "from-purple-50 to-purple-100",
                borderColor: "border-purple-200",
                iconGradient: "from-purple-400 to-purple-600",
                textColor: "text-purple-800",
                hoverBg: "from-purple-500 to-purple-600",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setActiveValue(index)}
                onMouseLeave={() => setActiveValue(null)}
              >
                <div
                  className={`bg-gradient-to-br ${value.bgGradient} rounded-2xl p-6 h-full border-2 ${value.borderColor} hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${value.iconGradient} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.letter}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">{value.icon}</div>
                    <h3 className={`text-lg font-bold ${value.textColor} mb-2`}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>

                  {/* Expanded description on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      value.hoverBg
                    } rounded-2xl p-6 flex items-center justify-center transition-all duration-300 ${
                      activeValue === index
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    <p className="text-white text-center text-base leading-relaxed text-pretty">
                      {value.fullDesc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Team Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4 text-balance">
              Đội Ngũ <span className="text-green-600">Sáng Lập</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 text-pretty">
              Những người trẻ đầy nhiệt huyết với sứ mệnh thay đổi nông nghiệp
              Việt Nam
            </p>
          </div>

          {/* Mentor */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mentor 1 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-1">
                <div className="bg-white rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                      <span className="text-4xl sm:text-5xl">👨‍🏫</span>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Phan Gia Hoàng
                      </h3>
                      <p className="text-lg sm:text-xl text-purple-600 font-semibold mb-3">
                        Giảng viên hướng dẫn
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-pretty">
                        Người thầy đã truyền cảm hứng và định hướng cho dự án
                        GrowMate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentor 2 */}
              <div className="bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl p-1">
                <div className="bg-white rounded-2xl p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-400 to-sky-400 rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                      <span className="text-4xl sm:text-5xl">👨‍🏫</span>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Nguyễn Phương Duy
                      </h3>
                      <p className="text-lg sm:text-xl text-indigo-600 font-semibold mb-3">
                        Mentor hướng dẫn
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-pretty">
                        Đồng hành cố vấn và định hướng chuyên môn cho đội ngũ
                        GrowMate từ những ngày đầu tiên và trong suốt quá trình phát triển.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Bottom accent to match Mentor 1 card */}
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-b-2xl"></div>
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="max-w-7xl mx-auto mb-16">
            {/* First Row - 2 Members */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
              {team.slice(0, 2).map((member, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-main p-6 sm:p-8 transform hover:-translate-y-2 transition-all duration-300">
                    <div
                      className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${member.bgGradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <img
                        src={member.icon}
                        alt={member.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h4>
                      <p
                        className={`text-lg font-semibold ${member.textColor} mb-3`}
                      >
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {member.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row - 3 Members */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {team.slice(2, 5).map((member, index) => (
                <div key={index + 2} className="group relative">
                  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-main p-6 sm:p-8 transform hover:-translate-y-2 transition-all duration-300">
                    <div
                      className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${member.bgGradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <img
                        src={member.icon}
                        alt={member.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h4>
                      <p
                        className={`text-lg font-semibold ${member.textColor} mb-3`}
                      >
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {member.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission with Z-Layout */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 text-balance">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Định hướng phát triển bền vững và tạo giá trị cho cộng đồng
            </p>
          </div>

          <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
            {/* Mission - Layout Left (Image Left, Content Right) */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image Left */}
              <div className="order-2 lg:order-1" data-aos="fade-right">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                  {/* Main card with image */}
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img
                        src={MissionImg}
                        alt="Mission"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute top-6 right-6 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-6 left-6 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Content Right */}
              <div className="order-1 lg:order-2" data-aos="fade-left">
                <div className="space-y-6">
                  {/* Title with Icon */}
                  <div className="flex items-center gap-4">
                    <div className="w-30 h-30 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <AimIconSvg size={80} className="text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight text-balance">
                      Sứ Mệnh Của Chúng Tôi
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-pretty">
                    Mang đến mô hình{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                      nông nghiệp số minh bạch, cảm xúc và bền vững
                    </span>
                    , nơi người tiêu dùng trở thành đối tác của cây trồng và
                    nông dân.
                  </p>
                </div>
              </div>
            </div>

            {/* Vision - Layout Right (Content Left, Image Right) */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content Left */}
              <div className="order-1" data-aos="fade-right">
                <div className="space-y-6">
                  {/* Title with Icon */}
                  <div className="flex items-center gap-4">
                    <div className="w-30 h-30 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <LeafIconSvg size={60} className=" text-white" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight text-balance">
                      Tầm Nhìn Của Chúng Tôi
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-pretty">
                    Trở thành nền tảng{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      "trải nghiệm nông nghiệp trực tuyến"
                    </span>{" "}
                    hàng đầu tại Việt Nam và Đông Nam Á, giúp mọi người sống
                    xanh và kết nối với thiên nhiên.
                  </p>
                </div>
              </div>

              {/* Image Right */}
              <div className="order-2" data-aos="fade-left">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                  {/* Main card with image */}
                  <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img
                        src={VisionImg}
                        alt="Vision"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute top-6 left-6 w-20 h-20 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-6 right-6 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8 sm:pt-12" data-aos="fade-up">
              <button
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/")}
              >
                <span className="text-base sm:text-lg">
                  Tham Gia Cùng Chúng Tôi
                </span>
                <ArrowRightIconSvg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
