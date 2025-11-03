import { Outlet } from "react-router-dom"
import FarmerHeader from "../components/Farmer/FarmerHeader"
import Footer from "../components/Footer"
import ScrollToTop from "../components/ScrollToTop"
import AuthAlertDialog from "../components/AuthAlertDialog"
import { useSessionMonitor } from "../hooks/useSessionMonitor"

const FarmerLayout = () => {
  const { showExpiryDialog, closeDialog } = useSessionMonitor()

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <FarmerHeader />
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      <Footer />
      {/* Session Expiry Dialog */}
      <AuthAlertDialog
        isOpen={showExpiryDialog}
        onClose={closeDialog}
        countdown={10}
      />
    </div>
  )
}

export default FarmerLayout
