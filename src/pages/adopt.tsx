import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import ItemBox from "../components/ItemBox"
import Pagination from "../components/Pagination"
import SearchBar from "../components/SearchBar"
import { getPosts } from "../services/API/postAPI"
import type { PostItem } from "../types/apiResponse/postResponse"
import useClientSearchPagination from "../hooks/useClientSearchPagination"
import { getAdoptImageUrl } from "../services/cloudinary/transformations"
import adoptHero from "../assets/imgs/adopt1.png"
import adoptHeroBg from "../assets/imgs/adoptHeroBackground.png"
import Breadcrumb from "../components/Breadcrumb"

const Adopt = () => {
  const navigate = useNavigate()

  const {
    items,
    rawPageItems,
    filteredItems,
    loading,
    searchQuery,
    handleSearchChange,
    currentPage,
    totalPages,
    handlePageChange,
    inSearchMode,
  } = useClientSearchPagination<PostItem>({
    pageSize: 8,
    batchAllPageSize: 100,
    fetchPage: async (page, pageSize) => {
      try {
        const res = await getPosts({ page, pageSize })
        const posts = res.data.items.filter(
          (post) => post.status !== "PENDING" && post.status !== "CANCELLED"
        )
        return {
          items: posts,
          totalPages: res.data.totalPages,
        }
      } catch (err) {
        toast.error("Không thể tải danh sách sản phẩm")
        throw err
      }
    },
    buildSearchString: (p) => {
      const displayId = `BDX${String(p.postId).padStart(3, "0")}`
      const title = `${p.productName} - ${p.productVariety} - ${p.farmName}`
      const unitStr = `${p.harvestWeight} ${p.unit} / năm`
      return `${displayId} ${title} ${unitStr}`
    },
    onError: (e) => {
      console.error(e)
    },
  })

  const handlePageChangeWithScroll = (page: number) => {
    handlePageChange(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />

      {/* Hero Section */}
      <section
        className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:h-[550px] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${adoptHeroBg})`,
        }}
      >
        {/* Gradient overlay for better depth and text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-0 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left content - Enhanced typography and spacing */}
            <div className="z-10 space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="group relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight cursor-default">
                  <span className="relative">
                    Cùng{" "}
                    <span className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-white via-main to-white bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                      GrowMate
                    </span>
                  </span>
                </h1>
                <div className="flex items-center gap-2 md:gap-3 justify-center lg:justify-start">
                  <div className="h-0.5 md:h-1 w-9 md:w-10 bg-main rounded-full" />
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/95 italic font-light font-greatvibes">
                    Tạo nên những khoảnh khắc đẹp
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-4 lg:px-0">
                Khám phá và nhận nuôi những cây trồng từ các nông trại uy tín,
                tạo nên kết nối bền vững giữa bạn và thiên nhiên.
              </p>

              <div className="flex items-center gap-4 pt-2 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    const tabsSection = document.getElementById("tabs-section")
                    if (tabsSection) {
                      tabsSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className="group relative bg-main hover:bg-green-600 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10">
                    Khám Phá Ngay Bên Dưới! 🌱
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>

            {/* Right side image - Enhanced with border and effects */}
            <div className="hidden lg:flex justify-center lg:justify-end items-center z-10">
              <div className="relative">
                {/* Decorative background circle */}
                <div className="absolute -inset-4 bg-gradient-to-br from-main/30 to-green-600/20 rounded-full blur-2xl" />

                {/* Image container with improved styling */}
                <div className="relative w-[300px] h-[250px] lg:w-[360px] lg:h-[300px] xl:w-[400px] xl:h-[330px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={adoptHero}
                    alt="Farmer working with plants"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-9 md:h-10 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Search Bar Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm cây trồng, nông trại..."
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading && rawPageItems.length === 0 && !inSearchMode ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-500">Đang tải...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Trial Package - Only show on first page */}
              {items.map((post) => {
                const firstMedia =
                  post.media && post.media.length > 0
                    ? (post.media[0] as { mediaUrl?: string })
                    : undefined

                const rawImage =
                  post.primaryImageUrl ||
                  post.mainImageUrl ||
                  firstMedia?.mediaUrl ||
                  ""
                const imageUrl = getAdoptImageUrl(rawImage, {
                  width: 600,
                  quality: 95,
                })

                return (
                  <ItemBox
                    key={post.postId}
                    id={`BDX${String(post.postId).padStart(3, "0")}`}
                    image={imageUrl}
                    title={`${post.productName} - ${post.productVariety} - ${post.farmName}`}
                    price={post.pricePerYear}
                    unit={`${post.harvestWeight} ${post.unit} / năm`}
                    rating={5}
                    onViewDetail={() => navigate(`/adopt/${post.postId}`)}
                  />
                )
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChangeWithScroll}
              className="mt-12"
              maxVisiblePages={5}
            />

            {inSearchMode
              ? filteredItems.length === 0 &&
              !loading && (
                <div className="text-center py-20 text-gray-500">
                  Không tìm thấy kết quả phù hợp
                </div>
              )
              : rawPageItems.length === 0 &&
              !loading && (
                <div className="text-center py-20 text-gray-500">
                  Không có sản phẩm nào
                </div>
              )}
          </>
        )}
      </section>
    </div>
  )
}

export default Adopt
