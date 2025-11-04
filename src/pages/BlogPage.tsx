import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BlogBox from "../components/BlogBox"
import SearchBar from "../components/SearchBar"
import Pagination from "../components/Pagination"
import { blogData } from "../data/blogData"
import { getDefaultBlogBackground } from "../utils/helpers/blogHelpers"

type CategoryTab = "all" | "tips" | "news" | "technology" | "gardening"

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const itemsPerPage = 9

  const categories = [
    { key: "all" as CategoryTab, label: "Tất Cả" },
    { key: "tips" as CategoryTab, label: "Mẹo Trồng Cây" },
    { key: "news" as CategoryTab, label: "Tin Tức" },
    { key: "technology" as CategoryTab, label: "Công Nghệ" },
    { key: "gardening" as CategoryTab, label: "Làm Vườn" },
  ]

  // Filter blogs by category and search
  const filteredBlogs = blogData.filter((blog) => {
    const matchesCategory = activeCategory === "all" || blog.category === activeCategory
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 blog-parallax blog-hero-bg"
          style={{ 
            backgroundImage: `url(${getDefaultBlogBackground()})`
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium border border-white/20 mb-4 sm:mb-6 shadow-lg">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></span>
                <span className="hidden sm:inline">
                  Kiến thức nông nghiệp hữu ích
                </span>
                <span className="sm:hidden">Kiến thức hữu ích</span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
                <span className="block">Tin Tức</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-200 to-emerald-200">
                  Nông Nghiệp
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                Khám phá những bài viết mới nhất về cây trồng, kỹ thuật nông nghiệp và xu hướng tiêu dùng nông sản sạch
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key)
                  setSearchQuery("")
                  setCurrentPage(1)
                }}
                className={`px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  activeCategory === cat.key
                    ? "bg-main text-white shadow-md shadow-main/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm bài viết theo tiêu đề, tác giả, từ khóa..."
            className="max-w-3xl mx-auto"
          />

          {searchQuery && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Tìm thấy{" "}
                <span className="font-semibold text-main">
                  {filteredBlogs.length}
                </span>{" "}
                bài viết
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentBlogs.length > 0 ? (
          <>
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {activeCategory === "all" ? "Tất Cả Bài Viết" : categories.find(c => c.key === activeCategory)?.label}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                Hiển thị {currentBlogs.length} trên {filteredBlogs.length} bài viết
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {currentBlogs.map((blog) => (
                <BlogBox
                  key={blog.id}
                  title={blog.title}
                  date={blog.date}
                  author={blog.author}
                  backgroundImage={blog.image}
                  onClick={() => handleBlogClick(blog.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-12"
                maxVisiblePages={5}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `Không có bài viết nào phù hợp với từ khóa "${searchQuery}"`
                : "Hiện tại chưa có bài viết nào trong danh mục này"
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2 bg-main text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default BlogPage
