import { useState, useEffect, useCallback, useRef } from "react"

/**
 * Generic client-side search + pagination helper.
 * Assumes backend currently lacks a unified search endpoint.
 * Strategy:
 *  - Normal mode: fetch single page from server.
 *  - Search mode: lazily load ALL pages once (batched) then filter locally.
 */
export interface UseClientSearchPaginationOptions<T> {
	/** Fetch a page from server; must return items + totalPages */
	fetchPage: (
		page: number,
		pageSize: number
	) => Promise<{ items: T[]; totalPages: number }>
	/** Extract searchable text for an item (lowercasing done internally) */
	buildSearchString: (item: T) => string
	/** Page size for normal & filtered pagination */
	pageSize?: number
	/** Batch size when loading all pages for search (default = pageSize or 50) */
	batchAllPageSize?: number
	/** Optional max pages to load (safety cap) */
	maxAllPages?: number
	/** Optional callback on errors */
	onError?: (err: unknown) => void
}

export interface UseClientSearchPaginationResult<T> {
	items: T[] // items for current view (either server page or filtered slice)
	rawPageItems: T[]
	filteredItems: T[]
	allItems: T[]
	loading: boolean
	searchQuery: string
	handleSearchChange: (value: string) => void
	setSearchQuery: (value: string) => void
	currentPage: number
	totalPages: number
	handlePageChange: (page: number) => void
	inSearchMode: boolean
	filteredCount: number
	pageSize: number
	reloadPage: () => Promise<void>
}

export function useClientSearchPagination<T>(
	options: UseClientSearchPaginationOptions<T>
): UseClientSearchPaginationResult<T> {
	const {
		fetchPage,
		buildSearchString,
		pageSize = 8,
		batchAllPageSize,
		maxAllPages,
		onError,
	} = options

	// Stabilize callbacks passed from parent to avoid recreating internal callbacks continuously
	const fetchPageRef = useRef(options.fetchPage)
	useEffect(() => {
		fetchPageRef.current = fetchPage
	}, [fetchPage])
	
	const buildSearchStringRef = useRef(options.buildSearchString)
	const onErrorRef = useRef(options.onError)
	useEffect(() => {
		onErrorRef.current = onError
	}, [onError])
	useEffect(() => {
		buildSearchStringRef.current = buildSearchString
	}, [buildSearchString])

	const batchSize = batchAllPageSize || pageSize || 50

	const [rawPageItems, setRawPageItems] = useState<T[]>([])
	const [allItems, setAllItems] = useState<T[]>([])
	const [filteredItems, setFilteredItems] = useState<T[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)

	const inSearchMode = searchQuery.trim().length > 0

	// Fetch a single page (normal mode)
	const loadPage = useCallback(
		async (page: number) => {
			setLoading(true)
			try {
				const res = await fetchPageRef.current(page, pageSize)
				setRawPageItems(res.items)
				if (!inSearchMode) setTotalPages(res.totalPages)
			} catch (err) {
				onErrorRef.current?.(err)
				console.error("loadPage error", err)
			} finally {
				setLoading(false)
			}
		},
		[pageSize, inSearchMode]
	)

	// Public reload
	const reloadPage = useCallback(async () => {
		await loadPage(currentPage)
	}, [loadPage, currentPage])

	// Load all items once when entering search mode
	const loadAllItems = useCallback(async () => {
		if (allItems.length > 0) return
		setLoading(true)
		try {
			let page = 1
			let aggregated: T[] = []
			const first = await fetchPageRef.current(page, batchSize)
			aggregated = aggregated.concat(first.items)
			let total = first.totalPages
			if (maxAllPages && maxAllPages < total) total = maxAllPages
			for (page = 2; page <= total; page++) {
				const res = await fetchPageRef.current(page, batchSize)
				aggregated = aggregated.concat(res.items)
			}
			setAllItems(aggregated)
		} catch (err) {
			onErrorRef.current?.(err)
			console.error("loadAllItems error", err)
		} finally {
			setLoading(false)
		}
	}, [allItems.length, batchSize, maxAllPages])

	// Apply search filter
	const applyFilter = useCallback(
		(q: string) => {
			const query = q.trim().toLowerCase()
			if (!query) {
				setFilteredItems([])
				return
			}
			const filtered = allItems.filter((item) =>
				buildSearchStringRef.current(item).toLowerCase().includes(query)
			)
			setFilteredItems(filtered)
			setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)))
		},
			[allItems, pageSize]
	)

	// Normal mode: fetch page when currentPage changes & not searching
	useEffect(() => {
		if (!inSearchMode) {
			loadPage(currentPage)
		}
	}, [currentPage, inSearchMode, loadPage])

	// Enter / update search mode
	useEffect(() => {
		if (inSearchMode) {
			if (allItems.length === 0) {
				loadAllItems()
			} else {
				applyFilter(searchQuery)
			}
		} else {
			setFilteredItems([])
		}
	}, [inSearchMode, searchQuery, allItems.length, loadAllItems, applyFilter])

	// Re-apply filter when allItems completes loading
	useEffect(() => {
		if (inSearchMode && allItems.length > 0) {
			applyFilter(searchQuery)
		}
	}, [inSearchMode, allItems.length, applyFilter, searchQuery])

	const handleSearchChange = useCallback((val: string) => {
		setSearchQuery(val)
		setCurrentPage(1)
	}, [])

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page)
	}, [])

	const items = inSearchMode
		? filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)
		: rawPageItems

	return {
		items,
		rawPageItems,
		filteredItems,
		allItems,
		loading,
		searchQuery,
		handleSearchChange,
		setSearchQuery,
		currentPage,
		totalPages,
		handlePageChange,
		inSearchMode,
		filteredCount: filteredItems.length,
		pageSize,
		reloadPage,
	}
}

export default useClientSearchPagination

