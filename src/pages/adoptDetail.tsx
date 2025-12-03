import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Breadcrumb from "../components/Breadcrumb"
import InfoTable from "../components/InfoTable"
import PostDescription from "../components/PostDescription"
import ItemComment from "../components/ItemComment"
import ItemBox from "../components/ItemBox"
import ShopAssuranceBadge from "../components/ShopAssuranceBadge"
import QuantitySelector from "../components/QuantitySelector"
import FacebookShareButton from "../components/FacebookShareButton"
import CopyLinkButton from "../components/CopyLinkButton"
import { getPosts, getPostById } from "../services/API/postAPI"
import type { PostItem } from "../types/apiResponse/postResponse"
import ShieldCheckIconSvg from "../assets/svgs/ShieldCheckIconSvg"
import CalendarIconSvg from "../assets/svgs/CalendarIconSvg"
import ThunderIconSvg from "../assets/svgs/ThunderIconSvg"
import { formatPrice } from "../utils/helpers/priceHelpers"
import CartIconSvg from "../assets/svgs/CartIconSvg"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import { addItem } from "../store/slices/cartSlice"
import { selectIsLoggedIn } from "../store/slices/authSlice"
import useServerCart from "../hooks/useServerCart"
import { getTreeListingByPostId } from "../services/API/treeListingAPI"
import {
  ADOPTDETAIL_PAGE_SIZE,
  FIXED_YEARS_ADOPT,
} from "../utils/constants/globalConstants"
import { getAdoptImageUrl } from "../services/cloudinary/transformations"

const AdoptDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)
  const { addListing } = useServerCart()
  const [post, setPost] = useState<PostItem | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1) // number of trees
  const [activeTab, setActiveTab] = useState<
    "info" | "harvest" | "description"
  >("info")

  const assuranceBadges = [
    {
      content:
        "Hoàn tiền 100% nếu nhà vườn huỷ trong 5-6 ngày treo lượng nông sản tươi",
      icon: <ShieldCheckIconSvg className="w-6 h-6 text-main" />,
    },
    {
      content: "Dự kiến thu hoạch: tháng 5-7/2025, nhận đầu thu khoảng 3kg/cây",
      icon: <CalendarIconSvg className="w-6 h-6 text-main" />,
    },
    {
      content:
        "Duy trình nuôi tâm hoạch gồm phá phu sa nước khoảng 30-35m tương ứng 9kg",
      icon: <ThunderIconSvg className="w-6 h-6 text-main" />,
    },
  ]

  // Fetch post detail
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await getPostById(Number(id))
        if (response?.data) {
          setPost(response.data)
        } else {
          toast.error("Không tìm thấy sản phẩm")
          navigate("/adopt")
        }
      } catch (error) {
        console.error("Failed to fetch post detail:", error)
        toast.error("Không thể tải thông tin sản phẩm")
        navigate("/adopt")
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [id, navigate])

  // Fetch related posts from same farm
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post) return
      try {
        const response = await getPosts({
          farmerId: post.farmerId,
          pageSize: ADOPTDETAIL_PAGE_SIZE,
        })
        // Filter out current post and limit to 3
        if (response?.data?.items && Array.isArray(response.data.items)) {
          const filtered = response.data.items
            .filter((p) => p.postId !== post.postId)
            .slice(0, 3)
          setRelatedPosts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch related posts:", error)
      }
    }

    fetchRelatedPosts()
  }, [post])

  const handleDurationChange = (increment: boolean) => {
    setQuantity((prev) => Math.max(1, prev + (increment ? 1 : -1)))
  }

  const handleAddToCart = async () => {
    if (!post) return

    try {
      if (isAuthenticated) {
        // Find listingId by postId, then add listing to cart
        const { data } = await getTreeListingByPostId(post.postId, false)
        const listingId = data.listingId
        if (!listingId) throw new Error("Không tìm thấy gói nhận nuôi")
        await addListing(Number(listingId), quantity, FIXED_YEARS_ADOPT)
      } else {
        // Guest fallback: add a pseudo product into local cart
        const mediaList = post.media || post.mediaPostList || []
        const firstMedia =
          Array.isArray(mediaList) && mediaList.length > 0
            ? (mediaList[0] as { mediaUrl?: string })
            : undefined
        const imageUrl =
          post.primaryImageUrl ||
          post.mainImageUrl ||
          firstMedia?.mediaUrl ||
          null

        const productCart = {
          productId: post.postId,
          name: `${post.productName} - ${post.productVariety}`,
          slug: `adopt-${post.postId}`,
          price: post.pricePerYear,
          stock: post.treeQuantity || 999,
          status: post.status,
          categoryName: post.productType,
          unitName: "cây",
          productTypeName: "Nhận nuôi",
          farmerName: post.farmName,
          mainImageUrl: imageUrl,
        }
        dispatch(
          addItem({
            product: productCart,
            quantity: quantity,
            years: FIXED_YEARS_ADOPT,
          })
        )
      }

      toast.success(`Đã thêm vào giỏ hàng thành công!`, {
        position: "top-right",
        autoClose: 2000,
      })
      setQuantity(1)
    } catch (error) {
      console.error("Failed to add adoption to cart:", error)
      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.")
    }
  }

  const handleBuyNow = async () => {
    if (!post) return
    try {
      if (isAuthenticated) {
        const { data } = await getTreeListingByPostId(post.postId, false)
        const listingId = data.listingId
        if (!listingId) throw new Error("Không tìm thấy gói nhận nuôi")
        await addListing(Number(listingId), quantity, FIXED_YEARS_ADOPT)
      } else {
        const mediaList = post.media || post.mediaPostList || []
        const firstMedia =
          Array.isArray(mediaList) && mediaList.length > 0
            ? (mediaList[0] as { mediaUrl?: string })
            : undefined
        const imageUrl =
          post.primaryImageUrl ||
          post.mainImageUrl ||
          firstMedia?.mediaUrl ||
          null

        dispatch(
          addItem({
            product: {
              productId: post.postId,
              name: `${post.productName} - ${post.productVariety}`,
              slug: `adopt-${post.postId}`,
              price: post.pricePerYear,
              stock: post.treeQuantity || 999,
              status: post.status,
              categoryName: post.productType,
              unitName: "cây",
              productTypeName: "Nhận nuôi",
              farmerName: post.farmName,
              mainImageUrl: imageUrl,
            },
            quantity: quantity,
            years: FIXED_YEARS_ADOPT,
          })
        )
      }

      navigate("/checkout", {
        state: {
          buyNowItem: {
            productId: post.postId,
            name: `${post.productName} - ${post.productVariety}`,
            price: post.pricePerYear,
            unitName: "cây",
            imageUrl:
              post.primaryImageUrl ||
              post.mainImageUrl ||
              (post.media?.[0] as { mediaUrl?: string })?.mediaUrl ||
              null,
            quantity: quantity,
            years: FIXED_YEARS_ADOPT,
          },
        },
      })
    } catch (error) {
      console.error("Buy now (adopt) failed:", error)
      toast.error("Không thể xử lý 'Thanh toán ngay'. Vui lòng thử lại.")
    }
  }

  // Totals with fixed years = 1
  const totalPrice = post ? post.pricePerYear * quantity : 0
  const totalHarvest = post ? post.harvestWeight * quantity : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Đang tải...</div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const displayId = `BDX${String(post.postId).padStart(3, "0")}`

  const mediaList = post.media || post.mediaPostList || []
  const firstMedia =
    Array.isArray(mediaList) && mediaList.length > 0
      ? (mediaList[0] as { mediaUrl?: string })
      : undefined
  const imageUrl = getAdoptImageUrl(
    post.primaryImageUrl || post.mainImageUrl || firstMedia?.mediaUrl || "",
    {
      width: 800,
      quality: 90,
    }
  )

  const tabs = [
    { key: "info" as const, label: "THÔNG TIN" },
    { key: "harvest" as const, label: "THỜI GIAN THU HOẠCH" },
    { key: "description" as const, label: "MÔ TẢ" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Nhận nuôi", path: "/adopt" },
          {
            label: post.productName,
            path: `/adopt/${post.postId}`,
            isActive: true,
          },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left: Image */}
            <div className="relative">
              <img
                src={imageUrl}
                alt={post.productName}
                className="w-full h-[500px] object-cover rounded-lg"
              />
              {/* Share Icons */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <FacebookShareButton
                  url={`${window.location.origin}/adopt/${post.postId}`}
                  title={`${post.productName} - ${post.productVariety} - ${post.farmName}`}
                  description={`Nhận nuôi ${post.productName} tại ${
                    post.farmName
                  }. Giá ${formatPrice(
                    post.pricePerYear
                  )}/năm. Sản lượng dự kiến: ${post.harvestWeight} ${
                    post.unit
                  }/cây/năm. ${post.description.substring(0, 100)}...`}
                  imageUrl={imageUrl}
                  hashtag="#GrowMate"
                />
                <CopyLinkButton
                  url={`${window.location.origin}/adopt/${post.postId}`}
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* ID Badge */}
              <div className="inline-flex items-center gap-2 bg-main/10 text-main px-4 py-2 rounded-lg font-bold text-sm mb-4 w-fit">
                <span>Mã sản phẩm:</span>
                <span>{displayId}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {post.productName}
              </h1>

              {/* Farm Name */}
              <p className="text-main font-medium text-lg mb-6">
                {post.farmName}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-main">
                    {formatPrice(post.pricePerYear)}
                  </span>
                  <span className="text-sm text-gray-500">(1 Đánh giá)</span>
                </div>
                <p className="text-sm text-gray-600">
                  Sản lượng dự kiến: {post.harvestWeight} {post.unit} / cây /
                  năm
                </p>
              </div>

              {/* Short Description */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              {/* Quantity & Duration Controls (years fixed to 1) */}
              <div className="mb-6">
                <QuantitySelector
                  label="Số lượng"
                  value={quantity}
                  unit="cây"
                  onIncrement={() => handleDurationChange(true)}
                  onDecrement={() => handleDurationChange(false)}
                />

                {/* Totals Display */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-main/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Tổng tiền</p>
                    <p className="font-bold text-main text-2xl">
                      {formatPrice(totalPrice)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Tổng sản lượng</p>
                    <p className="font-bold text-blue-700 text-2xl">
                      {totalHarvest} {post.unit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="bg-white border-2 border-main text-main px-6 py-3 rounded-lg font-semibold hover:bg-main hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <CartIconSvg size={5} />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-200"
                >
                  Thanh toán ngay
                </button>
              </div>

              {/* Assurance Badges */}
              <div className="space-y-3 border-t pt-6">
                {assuranceBadges.map((badge, index) => (
                  <ShopAssuranceBadge
                    key={index}
                    content={badge.content}
                    icon={badge.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 font-semibold text-sm transition-all duration-200 border-b-2 ${
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
                title={`THÔNG TIN ${post.productName.toUpperCase()} - ${displayId}`}
                rows={[
                  { label: "Mã sản phẩm", value: displayId, highlight: true },
                  { label: "Thuộc nông trại", value: post.farmName },
                  { label: "Loại", value: post.productType },
                  { label: "Giống", value: post.productVariety },
                  { label: "Xuất xứ", value: post.origin },
                  {
                    label: "Đặc điểm",
                    value:
                      "Hình dáng: thuôn dài, dưới trái nhọn uốn thon mềm mại. Màu xanh ngọc và ngả đến sang màu vàng tươi khi chín. Chất thịt: khi cắt ra thì giống xoài này cho cảm giác công chức, đầy thịt.",
                  },
                  {
                    label: "Cách bảo quản",
                    value: `Xoài nên bảo quản nơi thoáng mát, xoài để chín sau khoảng 2-5 ngày. Không nên bảo quản xoài bằng tủ lạnh khi chưng còn xanh vì nhiệt độ trong tủ sẽ ngăn cản trái chín.`,
                  },
                ]}
              />
            )}

            {activeTab === "harvest" && (
              <InfoTable
                title={`THỜI GIAN THU HOẠCH ${post.productName.toUpperCase()} - ${displayId}`}
                rows={[
                  {
                    label: "Tần suất thu hoạch",
                    value: `${post.harvestFrequency} lần/năm`,
                  },
                  {
                    label: "Đợt 1",
                    value: (
                      <div>
                        <div>Ngày bắt đầu thu hoạch: 01/05/2025</div>
                        <div>Ngày kết thúc thu hoạch: 31/07/2025</div>
                      </div>
                    ),
                  },
                ]}
              />
            )}

            {activeTab === "description" && (
              <PostDescription
                title={`MÔ TẢ ${post.productName.toUpperCase()} - ${displayId}`}
                subtitle={`Nguồn gốc và quy trình canh tác của ${post.productVariety} - ${post.farmName}`}
                sections={[
                  {
                    content: `Xuất xứ từ ${post.origin}, nơi có thổ nhưỡng phù sa và khí hậu ôn hòa quanh năm – nơi lý tưởng để phát triển cây xoài.\n\nGiống xoài này đã tồn tại hơn 80 năm và được cục sở hữu trí tuệ cấp chứng nhận chỉ dẫn địa lý, là biểu tượng của chất lượng nông sản miền Tây.`,
                  },
                  {
                    heading: `Đặc tính của ${post.productVariety}`,
                    content: post.description,
                  },
                ]}
              />
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              1 đánh giá cho sản phẩm này
            </h3>
            <ItemComment
              avatarUrl="/src/assets/imgs/homeFeedback1.png"
              userName="Dạt"
              date="2025-07-10"
              rating={5}
              comment="It has survived not only five centuries, but also the leap into electronic typesetting unchanged. It was popularised in the sheets containing lorem ipsum is simply free text. sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Vivaus sed delly molestie sapien."
            />
          </div>
        </div>

        {/* Related Products */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm cùng nhà vườn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedMediaList =
                  relatedPost.media || relatedPost.mediaPostList || []
                const relatedMedia =
                  Array.isArray(relatedMediaList) && relatedMediaList.length > 0
                    ? (relatedMediaList[0] as { mediaUrl?: string })
                    : undefined

                const relatedImageUrl = getAdoptImageUrl(
                  relatedPost.primaryImageUrl ||
                    relatedPost.mainImageUrl ||
                    relatedMedia?.mediaUrl ||
                    "",
                  { width: 600, quality: 85 }
                )

                return (
                  <ItemBox
                    key={relatedPost.postId}
                    id={`BDX${String(relatedPost.postId).padStart(3, "0")}`}
                    image={relatedImageUrl}
                    title={`${relatedPost.productName} - ${relatedPost.productVariety} - ${relatedPost.farmName}`}
                    price={relatedPost.pricePerYear}
                    unit={`${relatedPost.harvestWeight} ${relatedPost.unit} / năm`}
                    rating={5}
                    onViewDetail={() =>
                      navigate(`/adopt/${relatedPost.postId}`)
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

export default AdoptDetail
