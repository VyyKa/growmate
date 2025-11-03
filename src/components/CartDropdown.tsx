import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks"
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../store/slices/cartSlice"
import { formatPrice } from "../utils/helpers/priceHelpers"
import MoneyIconSvg from "../assets/svgs/MoneyIconSvg"

import ArrowRightIconSvg from "../assets/svgs/ArrowRightIconSvg"
import GarbageCanIconSvg from "../assets/svgs/GarbageCanIconSvg"
import useServerCart from "../hooks/useServerCart"
import { removeItem } from "../store/slices/cartSlice"
import { selectIsLoggedIn } from "../store/slices/authSlice"

const CartDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)
  const { hydrate, removeByProductId } = useServerCart()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    if (isAuthenticated) hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemoveItem = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAuthenticated) await removeByProductId(productId)
    else dispatch(removeItem({ productId }))
  }

  const handleViewCart = () => {
    navigate("/cart")
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (cartCount === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <GarbageCanIconSvg size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-2">Giỏ hàng trống</p>
          <p className="text-sm text-gray-500">
            Hãy thêm sản phẩm vào giỏ hàng
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-main to-green-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Giỏ hàng của bạn</h3>
          <span className="bg-white text-main px-2.5 py-0.5 rounded-full text-sm font-bold">
            {cartCount} sản phẩm
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex gap-3">
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl || "/src/assets/imgs/product1.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {item.quantity} {item.unitName}
                  </span>
                  {item.years && item.years > 0 && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                      {item.years} năm
                    </span>
                  )}
                  {item.stock < 10 && item.stock > 0 && (
                    <span className="text-orange-600 font-medium">
                      Còn {item.stock}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-main font-bold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={(e) => handleRemoveItem(item.productId, e)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">Tạm tính:</span>
          <span className="text-main font-bold text-lg">
            {formatPrice(cartTotal)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleViewCart}
            className="px-4 py-2.5 bg-white border-2 border-main text-main rounded-lg font-semibold hover:bg-main hover:text-white transition-all duration-300"
          >
            Xem giỏ hàng
          </button>
          <button
            onClick={handleCheckout}
            className="group relative px-4 py-2.5 bg-main hover:bg-yellow-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-md overflow-hidden"
          >
            {/* Text "Thanh toán" - hạ xuống khi hover */}
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-y-full">
              Thanh toán
            </span>
            <span className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300 -translate-y-full group-hover:translate-y-0">
              <MoneyIconSvg size={25} />
              <ArrowRightIconSvg
                size={25}
                className="group-hover:animate-bounceHorizontal"
              />
            </span>

            {/* Placeholder để giữ chiều cao button */}
            <span className="invisible">Thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartDropdown
