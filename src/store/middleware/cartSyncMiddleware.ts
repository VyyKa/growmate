import type { Middleware, AnyAction } from "@reduxjs/toolkit"
import { setCart, type CartState, type CartItem as ReduxCartItem } from "../slices/cartSlice"
import { addItemToCart, addTreeListingToCart, getCurrentCart } from "../../services/API/cartAPI"
import { getTreeListingByPostId } from "../../services/API/treeListingAPI"
import type { RootState } from "../store"
import type { CartDetail, CartItem as ServerCartItem } from "../../types/apiResponse/cartResponse"
import { setAuthToken } from "../../services/axiosClient"
import { loadFromLocalStorage, saveToLocalStorage } from "../localStorage"

const GUEST_CART_BACKUP_KEY = "guestCartBackup"

const saveGuestBackup = (cart: CartState) => {
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  saveToLocalStorage(GUEST_CART_BACKUP_KEY, cart, { expiresInMs: sevenDaysMs })
}

const loadGuestBackup = (): CartState | null => {
  const data = loadFromLocalStorage<CartState>(GUEST_CART_BACKUP_KEY, { checkExpiryField: "expiresAt" })
  if (data && Array.isArray(data.items)) return data
  return null
}

// Map server CartDetail to our Redux CartState
const mapServerCartToState = (cart: CartDetail): CartState => {
  const items: ReduxCartItem[] = cart.cartItems.map((ci: ServerCartItem) => {
    const isTree = (ci.listingId ?? 0) > 0 && (!ci.productId || ci.productId <= 0)
    const baseProductId = ci.productId ?? 0
    const syntheticProductId = isTree ? -Math.abs(Number(ci.listingId)) : baseProductId
    console.log(ci.listingId)
    console.log(syntheticProductId)
    return {
      productId: syntheticProductId,
      name: ci.productName,
      slug: String(syntheticProductId),
      price: ci.unitPrice,
      imageUrl: ci.productImageUrl,
      unitName: isTree ? "cây" : "",
      stock: 999999,
      quantity: ci.quantity,
      years: ci.years ?? undefined,
    }
  })
  return { items, updatedAt: Date.now() }
}

export const cartSyncMiddleware: Middleware<object, RootState> = (storeApi) => (next) => async (action) => {
  const typedAction = action as AnyAction
  // Pass action through first so reducers update state
  const result = next(action)

  // Login: auth/setCredentials
  if (typedAction?.type === "auth/setCredentials") {
      const state = storeApi.getState()
      const guestCart = state.cart as CartState
      // Backup guest cart for later restore on logout
      saveGuestBackup(guestCart)

      // Ensure axios has token immediately
  const token: string | undefined = state.auth?.token || (typedAction as AnyAction).payload?.token
      if (token) setAuthToken(token)
        
      // Merge guest items into server cart
      for (const item of guestCart.items) {
          const isAdopt = typeof item.slug === "string" && item.slug.startsWith("adopt-")
          if (isAdopt) {
            // support slug formats: adopt-<postId> or adopt-<postId>-y<years>
            const slugParts = item.slug.split("-")
            const postIdStr = slugParts[1]
            const yearsFromSlug = slugParts[2]?.startsWith("y") ? Number(slugParts[2].slice(1)) : NaN
            const years: number = Number.isFinite(yearsFromSlug) && yearsFromSlug > 0 ? yearsFromSlug : 1
            const postId = Number(postIdStr)
            if (Number.isFinite(postId) && postId > 0) {
              const { data } = await getTreeListingByPostId(postId, false)
              const listingId = data.listingId as number | undefined
              if (listingId) {
                await addTreeListingToCart({ listingId: Number(listingId), quantity: item.quantity, years })
              }
            }
          } else if (item.productId > 0) {
            await addItemToCart({ productId: item.productId, quantity: item.quantity })
          }
      }

      // Hydrate cart from server
        const res = await getCurrentCart()
        const data = res.data as CartDetail
        if (data && Array.isArray(data.cartItems)) {
          const stateMapped = mapServerCartToState(data)
          console.log(data)
          storeApi.dispatch(setCart(stateMapped))
        }
  }

  // Logout: auth/logout or auth/clearAuth
  if (typedAction?.type === "auth/logout" || typedAction?.type === "auth/clearAuth") {
    try {
      // Clear axios token immediately
      setAuthToken(undefined)
      const backup = loadGuestBackup()
      if (backup) {
        storeApi.dispatch(setCart(backup))
      } else {
        storeApi.dispatch(setCart({ items: [], updatedAt: Date.now() }))
      }
    } catch {
      // ignore restore failures
    }
  }

  return result
}

export default cartSyncMiddleware
