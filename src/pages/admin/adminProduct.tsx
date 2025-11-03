import { useEffect, useState } from "react"
import {
  Package,
  Search,
  Filter,
  Trash2,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Save,
  Edit,
  Upload,
} from "lucide-react"
import {
  getApprovedProducts,
  getPendingProducts,
  deleteProduct,
  updateProductStatus,
  createProduct,
  updateProduct,
  getProductById,
} from "../../services/API/productAPI"
import type {
  ProductItem,
  CreateProductPayload,
  UpdateProductPayload,
  ProductMediaInput,
} from "../../types/apiResponse/productResponse"
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget"

const AdminProduct = () => {
  const [approvedProducts, setApprovedProducts] = useState<ProductItem[]>([])
  const [pendingProducts, setPendingProducts] = useState<ProductItem[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  )

  // Create product form state
  const [createForm, setCreateForm] = useState<CreateProductPayload>({
    farmerId: 0,
    categoryId: 0,
    productTypeId: 0,
    unitId: 0,
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
  })

  // Edit product form state
  const [editForm, setEditForm] = useState<UpdateProductPayload>({
    farmerId: 0,
    categoryId: 0,
    productTypeId: 0,
    unitId: 0,
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
  })

  const [editProductId, setEditProductId] = useState<number>(0)
  const [currentProductImage, setCurrentProductImage] = useState<string>("")
  const [newProductImages, setNewProductImages] = useState<ProductMediaInput[]>(
    []
  )

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const [approvedRes, pendingRes] = await Promise.all([
        getApprovedProducts({ page: currentPage, pageSize: 20 }),
        getPendingProducts({ page: 1, pageSize: 100 }),
      ])

      setApprovedProducts(approvedRes.data.items)
      setPendingProducts(pendingRes.data.items)
      setTotalPages(approvedRes.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let allProducts: ProductItem[] = []

    // Combine based on status filter
    if (statusFilter === "all") {
      allProducts = [...approvedProducts, ...pendingProducts]
    } else if (statusFilter === "approved") {
      allProducts = approvedProducts
    } else if (statusFilter === "pending") {
      allProducts = pendingProducts
    } else if (statusFilter === "rejected") {
      allProducts = [...approvedProducts, ...pendingProducts].filter(
        (p) => p.status?.toLowerCase() === "rejected"
      )
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      allProducts = allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.farmerName?.toLowerCase().includes(query) ||
          p.categoryName?.toLowerCase().includes(query)
      )
    }

    setFilteredProducts(allProducts)
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, approvedProducts, pendingProducts])

  const handleDelete = async (productId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return

    try {
      await deleteProduct(productId)
      alert("Xóa sản phẩm thành công!")
      fetchProducts()
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("Xóa sản phẩm thất bại!")
    }
  }

  const handleApprove = async (productId: number) => {
    try {
      await updateProductStatus(productId, "APPROVE")
      alert("Duyệt sản phẩm thành công!")
      fetchProducts()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to approve product:", error)
      alert("Duyệt sản phẩm thất bại!")
    }
  }

  const handleReject = async (productId: number) => {
    try {
      await updateProductStatus(productId, "REJECT")
      alert("Từ chối sản phẩm thành công!")
      fetchProducts()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to reject product:", error)
      alert("Từ chối sản phẩm thất bại!")
    }
  }

  const handleCreateProduct = async () => {
    try {
      // Validate required fields
      if (
        !createForm.name ||
        !createForm.slug ||
        createForm.farmerId === 0 ||
        createForm.categoryId === 0 ||
        createForm.productTypeId === 0 ||
        createForm.unitId === 0
      ) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
        return
      }

      await createProduct(createForm)
      alert("Tạo sản phẩm thành công!")
      setIsCreateModalOpen(false)
      // Reset form
      setCreateForm({
        farmerId: 0,
        categoryId: 0,
        productTypeId: 0,
        unitId: 0,
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
      })
      fetchProducts()
    } catch (error) {
      console.error("Failed to create product:", error)
      alert("Tạo sản phẩm thất bại!")
    }
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    // Reset form
    setCreateForm({
      farmerId: 0,
      categoryId: 0,
      productTypeId: 0,
      unitId: 0,
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
    })
  }

  const handleUpdateProduct = async () => {
    try {
      // Validate required fields
      if (
        !editForm.name ||
        !editForm.slug ||
        editForm.farmerId === 0 ||
        editForm.categoryId === 0 ||
        editForm.productTypeId === 0 ||
        editForm.unitId === 0
      ) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
        return
      }

      // Prepare payload with media if new images uploaded
      const payload: UpdateProductPayload = {
        ...editForm,
        media: newProductImages.length > 0 ? newProductImages : undefined,
      }

      await updateProduct(editProductId, payload)
      alert("Cập nhật sản phẩm thành công!")
      setIsEditModalOpen(false)
      // Reset form
      setEditForm({
        farmerId: 0,
        categoryId: 0,
        productTypeId: 0,
        unitId: 0,
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
      })
      setEditProductId(0)
      setCurrentProductImage("")
      setNewProductImages([])
      fetchProducts()
    } catch (error) {
      console.error("Failed to update product:", error)
      alert("Cập nhật sản phẩm thất bại!")
    }
  }

  const openEditModal = async (product: ProductItem) => {
    try {
      setEditProductId(product.productId)
      // Fetch full product details
      const productDetail = await getProductById(product.productId)

      setEditForm({
        farmerId: productDetail.data.farmerId,
        categoryId: productDetail.data.categoryId || 0,
        productTypeId: productDetail.data.productTypeId || 0,
        unitId: productDetail.data.unitId || 0,
        name: productDetail.data.name,
        slug: productDetail.data.slug,
        description: productDetail.data.description,
        price: productDetail.data.price,
        stock: productDetail.data.stock,
      })

      // Set current product image
      setCurrentProductImage(productDetail.data.mainImageUrl || "")
      setIsEditModalOpen(true)
    } catch (error) {
      console.error("Failed to fetch product details:", error)
      // Fallback to basic info if API fails
      setEditProductId(product.productId)
      setEditForm({
        farmerId: 0,
        categoryId: 0,
        productTypeId: 0,
        unitId: 0,
        name: product.name,
        slug: product.slug,
        description: "",
        price: product.price,
        stock: product.stock,
      })
      setCurrentProductImage(product.mainImageUrl || "")
      setIsEditModalOpen(true)
    }
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditForm({
      farmerId: 0,
      categoryId: 0,
      productTypeId: 0,
      unitId: 0,
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
    })
    setEditProductId(0)
    setCurrentProductImage("")
    setNewProductImages([])
  }

  const openModal = (product?: ProductItem) => {
    setSelectedProduct(product || null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Đã duyệt
        </span>
      )
    } else if (lowerStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Chờ duyệt
        </span>
      )
    } else if (lowerStatus === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          Từ chối
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const stats = {
    total: approvedProducts.length + pendingProducts.length,
    approved: approvedProducts.length,
    pending: pendingProducts.length,
    rejected: [...approvedProducts, ...pendingProducts].filter(
      (p) => p.status.toLowerCase() === "rejected"
    ).length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-12 h-12 text-[var(--color-main)] animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và kiểm duyệt sản phẩm trên hệ thống
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã từ chối</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, nông dân, danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nông dân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.productId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.mainImageUrl ? (
                        <img
                          src={product.mainImageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.productTypeName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {product.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.farmerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock} {product.unitName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết sản phẩm
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Image */}
              {selectedProduct.mainImageUrl && (
                <div className="w-full">
                  <img
                    src={selectedProduct.mainImageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <p className="text-gray-900">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  {getStatusBadge(selectedProduct.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <p className="text-gray-900">
                    {selectedProduct.categoryName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại sản phẩm
                  </label>
                  <p className="text-gray-900">
                    {selectedProduct.productTypeName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nông dân
                  </label>
                  <p className="text-gray-900">{selectedProduct.farmerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị
                  </label>
                  <p className="text-gray-900">{selectedProduct.unitName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn kho
                  </label>
                  <p className="text-gray-900">
                    {selectedProduct.stock} {selectedProduct.unitName}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Pending Products */}
              {selectedProduct.status.toLowerCase() === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleApprove(selectedProduct.productId)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Duyệt sản phẩm
                  </button>
                  <button
                    onClick={() => handleReject(selectedProduct.productId)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[var(--color-main)] to-emerald-600">
              <h2 className="text-2xl font-bold text-white">
                Tạo sản phẩm mới
              </h2>
              <button
                onClick={closeCreateModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Slug */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={createForm.slug}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, slug: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="product-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version của tên sản phẩm
                  </p>
                </div>

                {/* Farmer ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.farmerId || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        farmerId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="ID nông dân"
                  />
                </div>

                {/* Category ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.categoryId || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        categoryId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="ID danh mục"
                  />
                </div>

                {/* Product Type ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.productTypeId || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        productTypeId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="ID loại sản phẩm"
                  />
                </div>

                {/* Unit ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.unitId || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        unitId: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="ID đơn vị"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.price || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={createForm.stock || ""}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent"
                    placeholder="Nhập mô tả sản phẩm..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateProduct}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Save className="w-5 h-5" />
                  Tạo sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
              <h2 className="text-2xl font-bold text-white">
                Chỉnh sửa sản phẩm
              </h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Image Section */}
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh hiện tại
                    </label>
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      {currentProductImage ? (
                        <img
                          src={currentProductImage}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <Package className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Chưa có hình ảnh</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload New Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tải ảnh mới lên
                    </label>
                    <CloudinaryUploadWidget
                      onUploaded={(result) => {
                        const newImage: ProductMediaInput = {
                          mediaUrl: result.url,
                          mediaType: "image",
                        }
                        setNewProductImages([newImage])
                        setCurrentProductImage(result.url)
                      }}
                      accept="image/*"
                      showAsButton={true}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload ảnh mới để thay thế ảnh hiện tại
                    </p>
                  </div>

                  {/* New Images Preview */}
                  {newProductImages.length > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Đã tải {newProductImages.length} ảnh mới
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className="md:col-span-2 space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.slug}
                      onChange={(e) =>
                        setEditForm({ ...editForm, slug: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="product-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly version của tên sản phẩm
                    </p>
                  </div>

                  {/* Grid for IDs */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Farmer ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farmer ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.farmerId || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            farmerId: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ID nông dân"
                      />
                    </div>

                    {/* Category ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.categoryId || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            categoryId: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ID danh mục"
                      />
                    </div>

                    {/* Product Type ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Type ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.productTypeId || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            productTypeId: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ID loại sản phẩm"
                      />
                    </div>

                    {/* Unit ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.unitId || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            unitId: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ID đơn vị"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá (VND) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.price || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng tồn kho <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editForm.stock || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mô tả sản phẩm..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                >
                  <Save className="w-5 h-5" />
                  Cập nhật sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProduct
