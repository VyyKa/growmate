import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Breadcrumb from "../components/Breadcrumb"
import InfoTable from "../components/InfoTable"
import PostDescription from "../components/PostDescription"
import ItemBox from "../components/ItemBox"
import QuantitySelector from "../components/QuantitySelector"
import FacebookShareButton from "../components/FacebookShareButton"
import CopyLinkButton from "../components/CopyLinkButton"
import ShopAssuranceBadge from "../components/ShopAssuranceBadge"
import { getProductById, getApprovedProducts } from "../services/API/productAPI"
import type {
  ProductDetail as ProductDetailType,
  ProductItem,
} from "../types/apiResponse/productResponse"
import { formatPrice } from "../utils/helpers/priceHelpers"
import CartIconSvg from "../assets/svgs/CartIconSvg"
import PackageIconSvg from "../assets/svgs/PackageIconSvg"
import RefundIconSvg from "../assets/svgs/RefundIconSvg"
import CheckCircleIconSvg from "../assets/svgs/CheckCircleIconSvg"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { addItem } from "../store/slices/cartSlice"
import { selectIsLoggedIn } from "../store/slices/authSlice"
import useServerCart from "../hooks/useServerCart"
import { getProductImageUrl } from "../services/cloudinary/transformations"

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const { addProduct } = useServerCart()
  const [product, setProduct] = useState<ProductDetailType | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([])
  //   const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<
    "info" | "specifications" | "description"
  >("info")

  // Fetch product detail
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!slug) return
      //   setLoading(true)
      try {
        const searchResponse = await getApprovedProducts({ pageSize: 100 })
        const foundProduct = searchResponse.data.items.find(
          (p) => p.slug === slug
        )

        if (foundProduct) {
          const response = await getProductById(foundProduct.productId)
          if (response?.data) {
            setProduct(response.data)
          } else {
            toast.error("Không tìm thấy sản phẩm")
            navigate("/products")
          }
        } else {
          toast.error("Không tìm thấy sản phẩm")
          navigate("/products")
        }
      } catch (error) {
        console.error("Failed to fetch product detail:", error)
        toast.error("Không thể tải thông tin sản phẩm")
        navigate("/products")
      } finally {
        // setLoading(false)
      }
    }

    fetchProductDetail()
  }, [slug, navigate])

  // Fetch related products from same category
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return
      try {
        const response = await getApprovedProducts({
          pageSize: 20,
        })
        // Filter products from same category and exclude current
        if (response?.data?.items && Array.isArray(response.data.items)) {
          const filtered = response.data.items
            .filter(
              (p) =>
                p.categoryName === product.categoryName &&
                p.productId !== product.productId
            )
            .slice(0, 3)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error)
      }
    }

    fetchRelatedProducts()
  }, [product])

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newValue = prev + (increment ? 1 : -1)
      return Math.max(1, Math.min(newValue, product?.stock || 999))
    })
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      if (isAuthenticated) {
        await addProduct(product.productId, quantity)
      } else {
        // Guest: local Redux cart
        dispatch(
          addItem({
            product: {
              productId: product.productId,
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              status: product.status,
              categoryName: product.categoryName,
              unitName: product.unitName,
              productTypeName: product.productTypeName,
              farmerName: product.farmerName,
              mainImageUrl: product.mainImageUrl,
            },
            quantity,
          })
        )
      }

      toast.success(
        `Đã thêm ${quantity} ${product.unitName} ${product.name} vào giỏ hàng!`,
        { position: "top-right", autoClose: 2000 }
      )
      setQuantity(1)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.")
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    try {
      if (isAuthenticated) {
        await addProduct(product.productId, quantity)
      } else {
        dispatch(
          addItem({
            product: {
              productId: product.productId,
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              status: product.status,
              categoryName: product.categoryName,
              unitName: product.unitName,
              productTypeName: product.productTypeName,
              farmerName: product.farmerName,
              mainImageUrl: product.mainImageUrl,
            },
            quantity,
          })
        )
      }

      navigate("/checkout", {
        state: {
          buyNowItem: {
            productId: product.productId,
            name: product.name,
            price: product.price,
            unitName: product.unitName,
            imageUrl: product.mainImageUrl || null,
            quantity,
          },
        },
      })
    } catch (error) {
      console.error("Buy now failed:", error)
      toast.error("Không thể xử lý 'Mua ngay'. Vui lòng thử lại.")
    }
  }

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //         <div className="text-center">
  //           <div className="relative w-16 h-16 mb-4 mx-auto">
  //             <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
  //             <div className="absolute inset-0 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
  //           </div>
  //           <p className="text-gray-500 font-medium">Đang tải sản phẩm...</p>
  //         </div>
  //       </div>
  //     )
  //   }

  if (!product) {
    return null
  }

  const displayId = `SP${String(product.productId).padStart(4, "0")}`

  const mediaList = product.media || []
  const firstMedia =
    Array.isArray(mediaList) && mediaList.length > 0
      ? (mediaList[0] as { mediaUrl?: string })
      : undefined
  const imageUrl = getProductImageUrl(
    product.mainImageUrl || firstMedia?.mediaUrl || "",
    { width: 800, quality: 90 }
  )

  const tabs = [
    { key: "info" as const, label: "THÔNG TIN" },
    { key: "specifications" as const, label: "THÔNG SỐ KỸ THUẬT" },
    { key: "description" as const, label: "MÔ TẢ CHI TIẾT" },
  ]

  const totalPrice = product.price * quantity

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Sản phẩm", path: "/products" },
          {
            label: product.name,
            path: `/products/${product.slug}`,
            isActive: true,
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Hero Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left: Image */}
            <div className="relative group">
              <div className="overflow-hidden rounded-xl">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              {/* Share Icons */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <FacebookShareButton
                  url={`${window.location.origin}/products/${product.slug}`}
                  title={product.name}
                  description={`${product.description} - Giá ${formatPrice(
                    product.price
                  )}. Còn ${product.stock} sản phẩm.`}
                  imageUrl={imageUrl}
                  hashtag="#GrowMate"
                />
                <CopyLinkButton
                  url={`${window.location.origin}/products/${product.slug}`}
                />
              </div>

              {/* Stock Badge */}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                  Chỉ còn {product.stock} sản phẩm!
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                  Hết hàng
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* ID Badge */}
              <div className="inline-flex items-center gap-2 bg-main/10 text-main px-4 py-2 rounded-lg font-bold text-sm mb-4 w-fit">
                <span>Mã sản phẩm:</span>
                <span>{displayId}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Category & Type */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {product.categoryName}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {product.productTypeName}
                </span>
              </div>

              {/* Farmer */}
              <p className="text-gray-600 mb-6">
                Nhà vườn:{" "}
                <span className="font-semibold text-main">
                  {product.farmerName}
                </span>
              </p>

              {/* Price */}
              <div className="mb-6 p-6 bg-gradient-to-br from-main/5 to-green-50 rounded-xl border border-main/20">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-main">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-500">/ {product.unitName}</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Tình trạng kho:
                  </span>
                  <span
                    className={`font-bold ${
                      product.stock > 10
                        ? "text-green-600"
                        : product.stock > 0
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `Còn ${product.stock} ${product.unitName}`
                      : "Hết hàng"}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <QuantitySelector
                    label="Số lượng"
                    value={quantity}
                    unit={product.unitName}
                    onIncrement={() => handleQuantityChange(true)}
                    onDecrement={() => handleQuantityChange(false)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Tổng tiền:{" "}
                    <span className="font-bold text-main text-lg">
                      {formatPrice(totalPrice)}
                    </span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="bg-white border-2 border-main text-main px-6 py-3 rounded-lg font-semibold hover:bg-main hover:text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-main"
                >
                  <CartIconSvg size={5} />
                  <span>Thêm vào giỏ</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
                >
                  Mua ngay
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-3 border-t pt-6">
                <ShopAssuranceBadge
                  icon={<CheckCircleIconSvg className="w-6 h-6 text-main" />}
                  content="Sản phẩm chính hãng, cam kết chất lượng"
                />
                <ShopAssuranceBadge
                  icon={<PackageIconSvg className="w-6 h-6 text-main" />}
                  content="Đóng gói cẩn thận, giao hàng toàn quốc"
                />
                <ShopAssuranceBadge
                  icon={<RefundIconSvg className="w-6 h-6 text-main" />}
                  content="Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-main text-main"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "info" && (
              <InfoTable
                title={`THÔNG TIN ${product.name.toUpperCase()} - ${displayId}`}
                rows={[
                  { label: "Mã sản phẩm", value: displayId, highlight: true },
                  { label: "Tên sản phẩm", value: product.name },
                  { label: "Danh mục", value: product.categoryName },
                  { label: "Loại", value: product.productTypeName },
                  { label: "Đơn vị", value: product.unitName },
                  { label: "Giá bán", value: formatPrice(product.price) },
                  { label: "Số lượng trong kho", value: String(product.stock) },
                  { label: "Nhà vườn", value: product.farmerName },
                ]}
              />
            )}

            {activeTab === "specifications" && (
              <InfoTable
                title={`THÔNG SỐ KỸ THUẬT ${product.name.toUpperCase()}`}
                rows={[
                  {
                    label: "Chất liệu",
                    value: product.productTypeName.includes("Dụng cụ")
                      ? "Thép không gỉ cao cấp"
                      : product.productTypeName.includes("Chậu")
                      ? "Nhựa PP cao cấp, chống tia UV"
                      : "Hữu cơ tự nhiên",
                  },
                  {
                    label: "Xuất xứ",
                    value: "Việt Nam",
                  },
                  {
                    label: "Bảo hành",
                    value: product.productTypeName.includes("Dụng cụ")
                      ? "6 tháng"
                      : "Không áp dụng",
                  },
                  {
                    label: "Hướng dẫn sử dụng",
                    value:
                      "Xem hướng dẫn chi tiết trên bao bì sản phẩm hoặc liên hệ hotline để được tư vấn.",
                  },
                ]}
              />
            )}

            {activeTab === "description" && (
              <PostDescription
                title={`MÔ TẢ CHI TIẾT ${product.name.toUpperCase()}`}
                subtitle={`Thông tin chi tiết về ${product.name}`}
                sections={[
                  {
                    heading: "Giới thiệu sản phẩm",
                    content: product.description,
                  },
                  {
                    heading: "Công dụng",
                    content: product.productTypeName.includes("Dụng cụ")
                      ? "Dụng cụ làm vườn chuyên dụng, giúp công việc chăm sóc cây trồng trở nên dễ dàng và hiệu quả hơn. Thiết kế ergonomic, tay cầm chống trượt, độ bền cao."
                      : product.productTypeName.includes("Phân bón")
                      ? "Cung cấp dinh dưỡng cân đối cho cây trồng, giúp cây phát triển khỏe mạnh, tăng năng suất và chất lượng nông sản. Thành phần hữu cơ tự nhiên, an toàn cho người và môi trường."
                      : product.productTypeName.includes("Chậu")
                      ? "Chậu trồng cây chất lượng cao, có lỗ thoát nước, giúp rễ cây phát triển tốt. Thiết kế đẹp mắt, phù hợp cho cả sân vườn và ban công."
                      : "Sản phẩm chất lượng cao, được nhiều người tin dùng trong việc chăm sóc cây trồng.",
                  },
                  {
                    heading: "Hướng dẫn bảo quản",
                    content:
                      "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đối với phân bón: đậy kín nắp sau khi sử dụng. Đối với dụng cụ: lau sạch sau khi sử dụng, bảo quản ở nơi khô ráo.",
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm cùng danh mục
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedImageUrl = getProductImageUrl(
                  relatedProduct.mainImageUrl || "",
                  { width: 600, quality: 85 }
                )
                return (
                  <ItemBox
                    key={relatedProduct.productId}
                    id={`SP${String(relatedProduct.productId).padStart(
                      4,
                      "0"
                    )}`}
                    image={relatedImageUrl}
                    title={relatedProduct.name}
                    price={relatedProduct.price}
                    unit={`${relatedProduct.unitName} • ${relatedProduct.stock} còn lại`}
                    rating={5}
                    className="rounded-xl"
                    onViewDetail={() =>
                      navigate(`/products/${relatedProduct.slug}`)
                    }
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
