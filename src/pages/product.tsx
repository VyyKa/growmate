import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ItemBox from "../components/ItemBox"
import Breadcrumb from "../components/Breadcrumb"
import SearchBar from "../components/SearchBar"
import Pagination from "../components/Pagination"
import { getApprovedProducts } from "../services/API/productAPI"
import type { ProductItem } from "../types/apiResponse/productResponse"
import useClientSearchPagination from "../hooks/useClientSearchPagination"
import productAll from "../assets/icons/productAll.png"
import productTools from "../assets/icons/productTool.png"
import productFertilizer from "../assets/icons/productCompost.png"
import productPots from "../assets/icons/productPot.png"
import productIrrigation from "../assets/icons/productWateringCan.png"
import { PRODUCT_PAGE_SIZE } from "../utils/constants/globalConstants"
import { getProductImageUrl } from "../services/cloudinary/transformations"

type CategoryTab = "all" | "tools" | "fertilizer" | "pots" | "irrigation"

const Product = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("all")
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
  } = useClientSearchPagination<ProductItem>({
    pageSize: PRODUCT_PAGE_SIZE,
    batchAllPageSize: 100,
    fetchPage: async (page, pageSize) => {
      try {
        const res = await getApprovedProducts({ page, pageSize })
        return { items: res.data.items, totalPages: res.data.totalPages }
      } catch (err) {
        toast.error("Không thể tải danh sách sản phẩm")
        throw err
      }
    },
    buildSearchString: (p) => {
      const displayId = `SP${String(p.productId).padStart(4, "0")}`
      return `${displayId} ${p.name} ${p.categoryName} ${p.productTypeName} ${p.farmerName}`
    },
    onError: (e) => {
      console.error(e)
    },
  })

  const categories = [
    { key: "all" as CategoryTab, label: "Tất Cả Sản Phẩm", icon: productAll },
    {
      key: "tools" as CategoryTab,
      label: "Dụng Cụ Làm Vườn",
      icon: productTools,
    },
    {
      key: "fertilizer" as CategoryTab,
      label: "Phân Bón & Đất",
      icon: productFertilizer,
    },
    { key: "pots" as CategoryTab, label: "Chậu & Khay", icon: productPots },
    {
      key: "irrigation" as CategoryTab,
      label: "Dụng Cụ Tưới & Phụ Kiện",
      icon: productIrrigation,
    },
  ]

  const handlePageChangeWithScroll = (page: number) => {
    handlePageChange(page)
    window.scrollTo({ top: 400, behavior: "smooth" })
  }

  const handleViewDetail = (slug: string) => {
    navigate(`/products/${slug}`)
  }

  // Category filtering helper
  const matchCategory = (p: ProductItem) => {
    if (activeCategory === "all") return true
    const cat = (p.categoryName || "").toLowerCase()
    const type = (p.productTypeName || "").toLowerCase()
    switch (activeCategory) {
      case "tools":
        return cat.includes("dụng cụ") || type.includes("dụng cụ")
      case "fertilizer":
        return (
          cat.includes("phân bón") ||
          cat.includes("đất") ||
          type.includes("phân bón") ||
          type.includes("đất")
        )
      case "pots":
        return (
          cat.includes("chậu") ||
          cat.includes("khay") ||
          type.includes("chậu") ||
          type.includes("khay")
        )
      case "irrigation":
        return cat.includes("tưới") || type.includes("tưới")
      default:
        return true
    }
  }

  // Apply category filter to datasets
  const displayedItems = items.filter(matchCategory)
  const pageFilteredCount = rawPageItems.filter(matchCategory).length
  const searchFilteredTotal = filteredItems.filter(matchCategory).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/src/assets/imgs/product1.jpg')",
          }}
        >
          {/* Dark gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          {/* Green accent overlay */}
          <div className="absolute inset-0 bg-main/20"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-main/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20 mb-6 shadow-lg">
                <span className="w-2 h-2 bg-main rounded-full animate-pulse shadow-lg shadow-main/50"></span>
                <span>Dụng cụ nông nghiệp chất lượng cao</span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Cửa Hàng
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-200 to-emerald-200">
                  Nông cụ & Vật tư
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                Khám phá bộ sưu tập đồ làm vườn chất lượng cao, được tuyển chọn
                kỹ lưỡng từ các nông trại uy tín
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 scrollbar-hide py-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key)
                  handleSearchChange("")
                  handlePageChange(1)
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-main text-white shadow-md shadow-main/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <img src={cat.icon} alt={cat.label} className="w-10 h-10" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm sản phẩm theo tên, danh mục, nông dân..."
            className="max-w-3xl mx-auto"
          />

          {inSearchMode && !loading && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Tìm thấy{" "}
                <span className="font-semibold text-main">
                  {searchFilteredTotal}
                </span>{" "}
                sản phẩm
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading && rawPageItems.length === 0 && !inSearchMode ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            {/* Results header */}
            {!inSearchMode && rawPageItems.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Sản Phẩm Nổi Bật
                </h2>
                <p className="text-sm text-gray-500">
                  Hiển thị {displayedItems.length} trên {pageFilteredCount} sản
                  phẩm
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map((product) => {
                const displayId = `SP${String(product.productId).padStart(
                  4,
                  "0"
                )}`
                const imageUrl = getProductImageUrl(
                  product.mainImageUrl || "",
                  { width: 600, quality: 85 }
                )
                return (
                  <ItemBox
                    key={product.productId}
                    id={displayId}
                    image={imageUrl}
                    title={product.name}
                    price={product.price}
                    unit={`${product.unitName} • ${product.stock} còn lại`}
                    rating={5}
                    className="rounded-xl"
                    onViewDetail={() => handleViewDetail(product.slug)}
                  />
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChangeWithScroll}
                className="mt-12"
                maxVisiblePages={7}
              />
            )}

            {/* Empty states */}
            {inSearchMode && searchFilteredTotal === 0 && !loading && (
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-6">
                  Không có sản phẩm nào phù hợp với từ khóa "{searchQuery}"
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="px-6 py-2 bg-main text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {!inSearchMode && pageFilteredCount === 0 && !loading && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Chưa có sản phẩm
                </h3>
                <p className="text-gray-500">
                  Hiện tại chưa có sản phẩm nào trong danh mục này
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Product
