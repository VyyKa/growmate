import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import AuthBanner from "../components/AuthBanner"
import ChatBot from "../components/ChatBot"
import AuthAlertDialog from "../components/AuthAlertDialog"
import { selectIsLoggedIn } from "../store/slices/authSlice"
import { useSelector } from "react-redux"
import { useSessionMonitor } from "../hooks/useSessionMonitor"
import ScrollToTop from "../components/ScrollToTop"

const MainLayout = () => {
  const isAuthenticated = useSelector(selectIsLoggedIn)
  const { showExpiryDialog, closeDialog } = useSessionMonitor()

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      {!isAuthenticated && <AuthBanner />}
      <Footer />
      <ChatBot />

      {/* Session Expiry Dialog */}
      <AuthAlertDialog
        isOpen={showExpiryDialog}
        onClose={closeDialog}
        countdown={10}
      />
    </>
  )
}

export default MainLayout
