import { BrowserRouter, Route, Routes } from "react-router-dom"
import RouteLoaderOverlay from "../components/RouteLoaderOverlay"
import MainLayout from "../layouts/MainLayout"
import FarmerLayout from "../layouts/FarmerLayout"
import AdminLayout from "../layouts/AdminLayout"
import Login from "../pages/login"
import Signup from "../pages/signup"
import GoogleCallback from "../pages/googleCallback"
import ForgotPassword from "../pages/forgotPassword"
import Adopt from "../pages/adopt"
import AdoptDetail from "../pages/adoptDetail"
import PolicyPage from "../pages/policy"
import AboutPage from "../pages/AboutPage"
import ContactPage from "../pages/ContactPage"
import Product from "../pages/product"
import ProductDetail from "../pages/productDetail"
import CartPage from "../pages/cart"
import CheckoutPage from "../pages/checkout"
import CheckoutReviewPage from "../pages/checkoutReview"
import CheckoutCallbackPage from "../pages/checkoutCallback"
import QRCheckout from "../pages/QRCheckout"
import OrderSuccessPage from "../pages/orderSuccess"
import BlogPage from "../pages/BlogPage"
import BlogDetailPage from "../pages/BlogDetailPage"
import Homepage from "../pages/Homepage"
import ProfilePage from "../pages/profile"
import AdoptManagementPage from "../pages/adoptManagement"
import OrderPage from "../pages/order"
import OrderDetailPage from "../pages/orderDetail"
import CameraPage from "../pages/camera"
import FarmerHome from "../pages/farmer/farmerHome"
import FarmerNewPost from "../pages/farmer/farmerNewPost"
import FarmerAdoption from "../pages/farmer/farmerAdoption"
import FarmerAdoptionDetail from "../pages/farmer/farmerAdoptionDetail"
import AdminHome from "../pages/admin/adminHome"
import AdminUser from "../pages/admin/adminUser"
import AdminProduct from "../pages/admin/adminProduct"
import AdminReport from "../pages/admin/adminReport"
import ProtectedRoute from "./ProtectedRoute"
import { UserRole } from "../types/enums/UserRole"
import AdminPostApprove from "../pages/admin/adminPostApprove"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RouteLoaderOverlay />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route path="google-callback" element={<GoogleCallback />} />
          <Route path="adopt" element={<Adopt />} />
          <Route path="adopt/:id" element={<AdoptDetail />} />
          <Route path="adopt/:id/camera" element={<CameraPage />} />
          <Route path="products" element={<Product />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="policy" element={<PolicyPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/review" element={<CheckoutReviewPage />} />
          <Route path="checkout/qr" element={<QRCheckout />} />
          <Route path="checkout/callback" element={<CheckoutCallbackPage />} />
          <Route path="order/success" element={<OrderSuccessPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="adopt-management" element={<AdoptManagementPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
        </Route>

        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowed={UserRole.Farmer} redirectPath="/login">
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FarmerHome />} />
          <Route path="adoptions" element={<FarmerAdoption />} />
          <Route path="adoptions/new" element={<FarmerNewPost />} />
          <Route path="posts/:id" element={<FarmerAdoptionDetail />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={UserRole.Admin} redirectPath="/login">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="posts" element={<AdminPostApprove />} />
          <Route path="reports" element={<AdminReport />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
