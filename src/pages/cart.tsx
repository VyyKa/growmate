import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../store/slices/cartSlice"
import { removeItem, updateQuantity } from "../store/slices/cartSlice"
import { formatPrice } from "../utils/helpers/priceHelpers"
import Breadcrumb from "../components/Breadcrumb"
import GarbageCanIconSvg from "../assets/svgs/GarbageCanIconSvg"
import useServerCart from "../hooks/useServerCart"
import { selectIsLoggedIn } from "../store/slices/authSlice"

const CartPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)
  const isAuthenticated = useAppSelector(selectIsLoggedIn)

  // Use server-backed removal
  const { hydrate, updateQuantityByProductId, removeByProductId } =
    useServerCart()

  useEffect(() => {
    if (isAuthenticated) hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleRemoveItem = async (productId: number) => {
    if (isAuthenticated) {
      await removeByProductId(productId)
      await hydrate()
    } else {
      dispatch(removeItem({ productId }))
    }
  }

  const handleUpdateQuantity = async (productId: number, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId)
    if (!item) return
    const newQuantity = Math.max(0, item.quantity + delta)
    if (isAuthenticated) {
      await updateQuantityByProductId(productId, newQuantity)
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }))
    }
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout")
  }

  // Empty cart state
  if (cartCount === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <GarbageCanIconSvg size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              của chúng tôi!
            </p>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-3 bg-main text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Sản phẩm trong giỏ</h2>
                <span className="bg-white text-main px-2.5 py-0.5 rounded-full text-sm font-bold">
                  {cartCount} sản phẩm
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.imageUrl || "/src/assets/imgs/product1.jpg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-main font-bold text-xl">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            / {item.unitName}
                          </span>
                          {item.years && item.years > 0 && (
                            <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg font-semibold text-sm">
                              {item.years} năm
                            </span>
                          )}
                        </div>
                        {item.stock < 10 && item.stock > 0 && (
                          <p className="text-orange-600 text-sm font-medium mb-2">
                            ⚠️ Chỉ còn {item.stock} {item.unitName}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, -1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-main hover:text-white transition-colors text-gray-700 font-bold"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.productId, 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-main hover:text-white transition-colors text-gray-700 font-bold"
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Tạm tính</p>
                          <p className="text-xl font-bold text-main">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <GarbageCanIconSvg size={16} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
              {/* Header */}
              <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Tổng đơn hàng</h2>
              </div>

              {/* Summary Details */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl text-main">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 bg-main hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Tiến hành thanh toán
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-white border-2 border-main text-main rounded-lg font-semibold hover:bg-green-50 transition-all duration-300"
                >
                  Mua thêm sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
