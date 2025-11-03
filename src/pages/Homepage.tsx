import BlogBox from "../components/BlogBox"
import AdvantageCard from "../components/AdvantageCard"
import FeedbackBox from "../components/FeedbackBox"
import home1 from "../assets/imgs/home1.png"
import home2 from "../assets/imgs/home2.png"
import home3 from "../assets/imgs/home3.png"
import home4 from "../assets/imgs/home4.png"
import homeAdvantage1 from "../assets/imgs/homeAdvantage1.png"
import homeAdvantage2 from "../assets/imgs/homeAdvantage2.png"
import homeAdvantage3 from "../assets/imgs/homeAdvantage3.png"
import homeAdvantage4 from "../assets/imgs/homeAdvantage4.png"
import homeBlog1 from "../assets/imgs/homeBlog1.png"
import homeBlog2 from "../assets/imgs/homeBlog2.png"
import homeBlog3 from "../assets/imgs/homeBlog3.png"
import homeFeedback1 from "../assets/imgs/homeFeedback1.png"
import homeFeedback2 from "../assets/imgs/homeFeedback2.png"
import LeafIconSvg from "../assets/svgs/LeafIconSvg"
import { useNavigate } from "react-router-dom"

import useRoleBasedRedirect from "../hooks/useRoleBasedRedirect"

const Homepage = () => {
  const nav = useNavigate()
  useRoleBasedRedirect()

  const listFeatures = [
    "Lựa chọn cây yêu thích từ nhiều nông trại uy tín",
    "Theo dõi quá trình phát triển qua camera trực tiếp",
    "Nhận trọn vẻn mùa vụ khi cây đến kỳ thu hoạch",
  ]

  const advantageCards = [
    {
      id: 1,
      backgroundImage: homeAdvantage1,
      title: "Minh bạch & đáng tin cậy",
    },
    {
      id: 2,
      backgroundImage: homeAdvantage2,
      title: "Tiết kiệm & cạnh tranh",
    },
    {
      id: 3,
      backgroundImage: homeAdvantage3,
      title: "Linh hoạt",
    },
    {
      id: 4,
      backgroundImage: homeAdvantage4,
      title: "Cảm Xúc",
    },
  ]

  const feedbackBoxs = [
    {
      id: 1,
      name: "Chị Vy",
      role: "Nhân viên văn phòng",
      rating: 5,
      avatarUrl: homeFeedback1,
      feedback:
        "Tôi và bạn trai cùng nhận nuôi cây ổi làm kỷ niệm tình yêu. Mỗi lần nhận trái là một kỷ niệm mới!",
    },
    {
      id: 2,
      name: "Anh Khả",
      role: "CSO",
      rating: 5,
      avatarUrl: homeFeedback2,
      feedback:
        "Lần đầu tiên tôi hiểu được cây trồng ra sao. Cảm ơn GrowMate vì trải nghiệm ý nghĩa này!",
    },
  ]

  const blogBoxs = [
    {
      id: "top-5-fruits-2025",
      title: "Top 5 loại trái cây ăn quả nổi bật năm 2025",
      date: "01 July 2025",
      author: "Hồ Khá",
      backgroundImage: homeBlog1,
    },
    {
      id: "summer-fruit-care",
      title: "Làm thế nào để chăm sóc cây ăn quả trong mùa hè?",
      date: "05 July 2025",
      author: "Hồ Khá",
      backgroundImage: homeBlog2,
    },
    {
      id: "growmate-journey",
      title: "Hành trình GrowMate: Kết nối nông dân và người tiêu dùng",
      date: "10 July 2025",
      author: "Hồ Khá",
      backgroundImage: homeBlog3,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[500px] md:h-[600px] w-full flex flex-col items-start text-left text-white"
        style={{ backgroundImage: `url(${home1})` }}
      >
        <div className="relative z-10 px-2 max-w-4xl mx-32 mt-32">
          <h2 className="text-sm md:text-base mb-4 font-normal tracking-wide uppercase">
            CHÀO MỪNG ĐẾN VỚI DỰ ÁN
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
              style={{ fontFamily: "cursive" }}
            >
              GROWMATE
            </h1>
            <LeafIconSvg className="w-16 h-16 md:w-20 md:h-20 text-green-400" />
          </div>
          <h3 className="text-lg md:text-xl font-light italic">
            "Từ khu vườn nhỏ đến giỏ trái cây tươi"
          </h3>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Images */}
          <div className="relative">
            {/* Large circular image */}
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden mx-auto">
              <img
                src={home2}
                alt="GrowMate Farm"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Small circular image overlay */}
            <div className="absolute bottom-8 left-8 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={home3}
                alt="GrowMate Products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <h3 className="text-yellow-500 text-lg font-semibold">
              Về Chúng Tôi
            </h3>
            <h1 className="text-6xl md:text-6xl font-bold text-gray-900">
              GrowMate là gì?
            </h1>
            <p className="text-green-600 leading-relaxed font-bold">
              GrowMate là nền tảng kết nối người trồng cây ăn quả với người tiêu
              dùng muốn nhận nuôi cây trồng. Qua nền tảng trực tuyến, bạn có
              thể:
            </p>
            <ul className="space-y-3 text-gray-600">
              {listFeatures.map((feature, index) => (
                <li className="flex items-center gap-3" key={index}>
                  <span className="w-2 h-2 bg-main rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi hướng đến một mô hình nông nghiệp sạch, minh bạch và kết
              nối cảm xúc giữa người dùng với thiên nhiên
            </p>
            <button
              className="bg-main text-white px-8 py-3 rounded-lg hover:bg-green-500 transition-colors cursor-pointer"
              onClick={() => nav("/about")}
            >
              Khám Phá Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div
        className="relative py-20 md:px-8 lg:px-16 text-left text-white "
        style={{ backgroundImage: `url(${home4})` }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Mô hình thúc đẩy nông nghiệp sạch, minh bạch và bền vững
          </h1>
          <p className="text-lg leading-relaxed">
            Chúng tôi cam kết mang đến một hệ sinh thái nông nghiệp bền vững,
            nơi người tiêu dùng có thể tin tưởng vào nguồn gốc sản phẩm.
          </p>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            CÁC ƯU ĐIỂM ĐEM LẠI
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            GrowMate mang đến những giá trị độc đáo cho cả nông dân và người
            tiêu dùng
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantageCards.map((card) => (
              <AdvantageCard
                key={card.id}
                backgroundImage={card.backgroundImage}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-green-500 text-lg font-semibold mb-2">
              Our Testimonials
            </h3>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mọi người nói gì về GrowMate
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Một số feedback của người dùng về dự án GrowMate nè!
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {feedbackBoxs.map((feedback) => (
              <FeedbackBox
                key={feedback.id}
                feedback={feedback.feedback}
                name={feedback.name}
                role={feedback.role}
                rating={feedback.rating}
                avatarUrl={feedback.avatarUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-green-500 text-lg font-semibold mb-2">
              From the Blog
            </h3>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Tin Tức Mới
            </h1>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogBoxs.map((blog) => (
              <BlogBox
                key={blog.id}
                title={blog.title}
                date={blog.date}
                author={blog.author}
                backgroundImage={blog.backgroundImage}
                onClick={() => nav(`/blog/${blog.id}`)}
              />
            ))}
          </div>
          <div className="text-center">
            <button
              className="bg-main text-white px-8 py-3 rounded-lg hover:bg-green-500 transition-colors cursor-pointer"
              onClick={() => nav("/blog")}
            >
              Xem thêm tin tức
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage
