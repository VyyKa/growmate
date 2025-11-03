import { useState, useRef, useEffect } from "react"
import CartIconSvg from "../assets/svgs/CartIconSvg"
import CartDropdown from "./CartDropdown"
import { useAppSelector } from "../hooks/reduxHooks"
import { selectCartCount } from "../store/slices/cartSlice"
import useServerCart from "../hooks/useServerCart"
import { selectIsLoggedIn } from "../store/slices/authSlice"

const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const cartCount = useAppSelector(selectCartCount)
  const prevCountRef = useRef(cartCount)
  const { hydrate } = useServerCart()
  const isAuthenticated = useAppSelector(selectIsLoggedIn)

  // Trigger animation when cart count changes
  useEffect(() => {
    if (cartCount > prevCountRef.current) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      prevCountRef.current = cartCount
      return () => clearTimeout(timer)
    }
    prevCountRef.current = cartCount
  }, [cartCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next && isAuthenticated) hydrate()
      return next
    })
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`relative bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 group cursor-pointer ${
          isOpen ? "ring-2 ring-green-300" : ""
        }`}
      >
        <div className="relative">
          <CartIconSvg size={6} className="text-white" />
          <span
            className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-300 ${
              cartCount > 10
                ? "w-7 h-7 -top-4 -right-4"
                : "w-5 h-5 -top-2 -right-2"
            } ${
              isAnimating
                ? "animate-[bounce_0.5s_ease-in-out] scale-110"
                : "scale-100"
            }`}
          >
            {cartCount > 10 ? "10+" : cartCount}
          </span>
        </div>
      </button>

      {isOpen && (
        <div ref={dropdownRef}>
          <CartDropdown />
        </div>
      )}
    </div>
  )
}

export default CartButton
