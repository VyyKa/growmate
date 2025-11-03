import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import type { ProductItem } from "../../types/apiResponse/productResponse"
import { loadFromLocalStorage, saveToLocalStorage } from "../localStorage"

// Types
export type CartItem = {
	productId: number
	name: string
	slug: string
	price: number
	imageUrl: string | null
	unitName: string
	stock: number
	quantity: number
	years?: number // For adoption items
}

export interface CartState {
	items: CartItem[]
	// Optional meta for future features (voucher, notes, etc.)
	updatedAt?: number
}

// LocalStorage
const CART_KEY = "cart"

// Initial state
const initialState: CartState =
	loadFromLocalStorage<CartState>(CART_KEY) ?? { items: [] }

// Payloads
type AddItemPayload = { product: ProductItem; quantity?: number; years?: number }
type UpdateQuantityPayload = { productId: number; quantity: number }
type RemoveItemPayload = { productId: number }

// Slice
const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItem: (state, action: PayloadAction<AddItemPayload>) => {
			const { product, quantity = 1, years } = action.payload
			const idx = state.items.findIndex((i) => i.productId === product.productId)
			const maxQty = Math.max(0, product.stock)
			if (idx >= 0) {
				// increase quantity up to stock
				const nextQty = Math.min(state.items[idx].quantity + quantity, maxQty || state.items[idx].quantity + quantity)
				state.items[idx].quantity = Math.max(1, nextQty)
				if (years !== undefined) state.items[idx].years = years
			} else {
				state.items.push({
					productId: product.productId,
					name: product.name,
					slug: product.slug,
					price: product.price,
					imageUrl: product.mainImageUrl ?? null,
					unitName: product.unitName,
					stock: product.stock,
					quantity: Math.max(1, Math.min(quantity, maxQty || quantity)),
					years: years,
				})
			}
			state.updatedAt = Date.now()
			saveToLocalStorage(CART_KEY, state)
		},
		updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
			const { productId, quantity } = action.payload
			const item = state.items.find((i) => i.productId === productId)
			if (!item) return
			if (quantity <= 0) {
				// remove item when quantity <= 0
				state.items = state.items.filter((i) => i.productId !== productId)
			} else {
				const maxQty = Math.max(0, item.stock)
				item.quantity = Math.max(1, Math.min(quantity, maxQty || quantity))
			}
			state.updatedAt = Date.now()
			saveToLocalStorage(CART_KEY, state)
		},
		removeItem: (state, action: PayloadAction<RemoveItemPayload>) => {
			const { productId } = action.payload
			state.items = state.items.filter((i) => i.productId !== productId)
			state.updatedAt = Date.now()
			saveToLocalStorage(CART_KEY, state)
		},
		clearCart: (state) => {
			state.items = []
			state.updatedAt = Date.now()
			saveToLocalStorage(CART_KEY, state)
		},
		// For hydration from server or merging persisted state
		setCart: (state, action: PayloadAction<CartState>) => {
			state.items = action.payload.items
			state.updatedAt = Date.now()
			saveToLocalStorage(CART_KEY, state)
		},
	},
})

// Selectors
export const selectCart = (state: RootState) => state.cart
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartCount = (state: RootState) =>
	state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotal = (state: RootState) =>
	state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
export const selectCartItemQuantity = (productId: number) => (state: RootState) =>
	state.cart.items.find((i) => i.productId === productId)?.quantity ?? 0

export const { addItem, updateQuantity, removeItem, clearCart, setCart } = cartSlice.actions
export default cartSlice.reducer

