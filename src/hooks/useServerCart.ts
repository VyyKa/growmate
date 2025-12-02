import { useCallback, useRef } from "react"
import { useAppDispatch } from "./reduxHooks"
import { setCart, type CartState, type CartItem as ReduxCartItem } from "../store/slices/cartSlice"
import { getCurrentCart, addItemToCart, addTreeListingToCart, updateCartItemQuantity, removeCartItem } from "../services/API/cartAPI"
import type { CartDetail, UpdateCartItemPayload, CartItem as ServerCartItem } from "../types/apiResponse/cartResponse"
import { getProductById } from "../services/API/productAPI"

type MappingEntry = {
  cartItemId: number
  listingId: number | null
  type: "Product" | "Tree"
  years: number | null
}

// Build Redux items and a mapping from productId -> cartItemId
const buildStateFromServer = (cart: CartDetail) => {
  const mapping = new Map<number, MappingEntry>()
  const items: ReduxCartItem[] = cart.cartItems.map((ci: ServerCartItem) => {
    const isTree = (ci.listingId ?? 0) > 0 && (!ci.productId || ci.productId <= 0)
    const baseProductId = ci.productId ?? 0
    const syntheticProductId = isTree ? -Math.abs(Number(ci.listingId)) : baseProductId
    
    const item: ReduxCartItem = {
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
    mapping.set(syntheticProductId, {
      cartItemId: ci.cartItemId,
      listingId: ci.listingId,
      type: isTree ? "Tree" : "Product",
      years: ci.years ?? null,
    })
    return item
  })
  const state: CartState = { items, updatedAt: Date.now() }
  return { state, mapping }
}

export const useServerCart = () => {
  const dispatch = useAppDispatch()
  const mappingRef = useRef<Map<number, MappingEntry>>(new Map())

  const hydrate = useCallback(async () => {
    const res = await getCurrentCart()
    const data = res.data as CartDetail
    if (data && Array.isArray(data.cartItems)) {
      const { state, mapping } = buildStateFromServer(data)
      // Enrich unitName for product items (server doesn't provide unit)
      const missingUnitProductIds = Array.from(new Set(
        state.items
          .filter((i) => i.productId > 0 && (!i.unitName || i.unitName.trim() === ""))
          .map((i) => i.productId)
      ))

      if (missingUnitProductIds.length > 0) {
          const details = await Promise.all(
            missingUnitProductIds.map(async (id) => {
              try {
                const { data: prod } = await getProductById(id)
                return { id, unitName: prod.unitName ?? "", stock: prod.stock ?? 0 }
              } catch {
                return { id, unitName: "", stock: 0 }
              }
            })
          )
          const byId = new Map(details.map((d) => [d.id, d]))
          state.items = state.items.map((it) => {
            if (it.productId > 0 && (!it.unitName || it.unitName.trim() === "")) {
              const info = byId.get(it.productId)
              return info
                ? { ...it, unitName: info.unitName || it.unitName, stock: info.stock || it.stock }
                : it
            }
            return it
          })
      }

      mappingRef.current = mapping
      dispatch(setCart(state))
    }
    return res
  }, [dispatch])

  const addProduct = useCallback(async (productId: number, quantity = 1) => {
    await addItemToCart({ productId, quantity })
    await hydrate()
  }, [hydrate])

  const addListing = useCallback(async (listingId: number, quantity = 1, years = 1) => {
    await addTreeListingToCart({ listingId, quantity, years })
    await hydrate()
  }, [hydrate])

  const ensureCartItemId = useCallback(async (productId: number) => {
    let entry = mappingRef.current.get(productId)
    if (!entry) {
      await hydrate()
      entry = mappingRef.current.get(productId)
    }
    return entry?.cartItemId
  }, [hydrate])

  const updateQuantityByProductId = useCallback(async (productId: number, quantity: number) => {
    const id = await ensureCartItemId(productId)
    const entry = mappingRef.current.get(productId)
    if (id !== undefined) {
      const payload: UpdateCartItemPayload = entry?.type === "Tree"
        ? { quantity, years: entry?.years ?? 1 }
        : { quantity }
      await updateCartItemQuantity(id, payload)
      await hydrate()
    }
  }, [ensureCartItemId, hydrate])

  const removeByProductId = useCallback(async (productId: number) => {
    const id = await ensureCartItemId(productId)
    if (id !== undefined) {
      await removeCartItem(id)
      await hydrate()
    }
  }, [ensureCartItemId, hydrate])

  return {
    hydrate,
    addProduct,
    addListing,
    updateQuantityByProductId,
    removeByProductId,
  }
}

export default useServerCart
