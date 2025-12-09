import { useNavigate } from "react-router-dom"
import Breadcrumb from "../components/Breadcrumb"
import { formatPrice } from "../utils/helpers/priceHelpers"
import {
  TRIAL_DURATION_DAYS,
  TRIAL_PACKAGE_INFO,
} from "../utils/constants/trialPackage"

const TrialPage = () => {
  const navigate = useNavigate()

  const handleStartTrial = () => {
    navigate("/checkout", {
      state: {
        isTrial: true,
        tree: {
          treeId: TRIAL_PACKAGE_INFO.treeId,
          listingId: TRIAL_PACKAGE_INFO.listingId,
          farmerId: TRIAL_PACKAGE_INFO.farmerId,
          treeName: TRIAL_PACKAGE_INFO.treeName,
          farmerName: TRIAL_PACKAGE_INFO.farmerName,
          pricePerYear: TRIAL_PACKAGE_INFO.pricePerYear,
          unit: TRIAL_PACKAGE_INFO.durationText,
          description: TRIAL_PACKAGE_INFO.description,
          image: TRIAL_PACKAGE_INFO.image,
        },
      },
    })
  }

  const steps = [
    {
      title: "Ngày 1",
      desc: "Kích hoạt tài khoản và trải nghiệm các chức năng",
      items: ["Kích hoạt tài khoản", "Mở dashboard theo dõi cây" ],
    },
    {
      title: "Ngày 2",
      desc: "Trải nghiệm báo cáo",
      items: ["Xem báo cáo", "Theo dõi lộ trình cây"],
    },
    {
      title: "Ngày 3",
      desc: "Tổng kết và nâng cấp",
      items: ["Nhận tổng kết trải nghiệm", "Chốt ưu đãi gói thật"],
    },
  ]

  const highlights = [
    {
      title: "Không cần thẻ ngân hàng",
      value: "100% miễn phí",
      desc: "Khởi động và lưu toàn bộ dữ liệu trên trình duyệt của bạn.",
    },
    {
      title: "Tương tác như thật",
      value: "Báo cáo & camera",
      desc: "Nhận thông báo, xem báo cáo, thử camera mô phỏng giống gói thật.",
    },
    {
      title: "Chuyển đổi mượt",
      value: "1 click",
      desc: "Nâng cấp sang gói trả phí ngay sau khi ưng ý, không mất dữ liệu.",
    },
  ]

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white min-h-screen">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Gói dùng thử", path: "/trial", isActive: true },
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-64 bg-gradient-to-r from-lime-200 via-transparent to-emerald-200 blur-3xl opacity-70" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow text-xs font-semibold text-main">
              <span className="text-lg">🌱</span> Gói trải nghiệm GrowMate
            </div>

            <div className="space-y-3">
              <p className="font-greatvibes text-2xl text-main">
                Grow green. Live better.
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 tracking-tight">
                Trải nghiệm nuôi cây
                <div className="text-main">{TRIAL_DURATION_DAYS} ngày miễn phí</div>
              </h1>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
              Toàn bộ hành trình được sử dụng giống gói thật!!!
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartTrial}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-main to-emerald-600 text-white font-semibold shadow-lg hover:translate-y-[-2px] transition-transform focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-main"
              >
                Bắt đầu dùng thử ngay
              </button>
              <button
                onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}
                className="px-8 py-3 rounded-full border-2 border-main text-main font-semibold hover:bg-main/10 transition"
              >
                Xem hành trình thử
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/80 rounded-2xl p-4 shadow-sm border border-emerald-100"
                >
                  <p className="text-sm font-semibold text-main mb-1">{item.title}</p>
                  <p className="text-2xl font-black text-gray-900">{item.value}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-main/10 blur-3xl rounded-full" />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
              <img
                src={TRIAL_PACKAGE_INFO.image}
                alt="Trial tree"
                className="w-full h-72 object-cover"
              />
              <div className="p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                      Mã gói
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900">
                      TRIAL-3 NGÀY
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                      Giá trải nghiệm
                    </p>
                    <p className="text-4xl font-black text-main">
                      {formatPrice(TRIAL_PACKAGE_INFO.pricePerYear)}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-main text-lg">•</span>
                    Nông trại: <strong>{TRIAL_PACKAGE_INFO.farmerName}</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-main text-lg">•</span>
                    Gói Cây: <strong>{TRIAL_PACKAGE_INFO.treeName}</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-main text-lg">•</span>
                    Thời lượng: <strong>{TRIAL_PACKAGE_INFO.durationText}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-main/10 text-main text-xs font-semibold uppercase tracking-[0.35em]">
            Bạn nhận được gì?
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">
            Tất cả tính năng như gói thật, trong {TRIAL_DURATION_DAYS} ngày
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRIAL_PACKAGE_INFO.perks.map((perk) => (
            <div
              key={perk}
              className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-main/10 text-main flex items-center justify-center text-xl font-bold">
                ✨
              </div>
              <p className="font-semibold text-lg text-gray-800 leading-snug">
                {perk}
              </p>
              <div className="h-[2px] w-12 bg-gradient-to-r from-main to-lime-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_top,_#064e3b,_#022c22)] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-50 text-xs font-semibold uppercase tracking-[0.35em]">
              Lộ trình trải nghiệm
            </div>
            <h2 className="text-3xl md:text-4xl font-black mt-3">3 ngày, rõ ràng từng bước</h2>
            <p className="text-emerald-100 mt-3">
              Mỗi ngày đều có nhiệm vụ rõ ràng để bạn thử hết tính năng trước khi quyết định.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="bg-white/10 rounded-2xl p-6 border border-white/15 backdrop-blur shadow-lg hover:bg-white/15 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">
                    {step.title}
                  </p>
                  <span className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-100 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 mt-1">{step.desc}</h3>
                <ul className="space-y-2 text-sm text-emerald-50 leading-relaxed">
                  {step.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-200">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-10 space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Sẵn sàng trải nghiệm GrowMate?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chỉ cần một cú nhấp chuột, bạn sẽ được đưa vào thế giới của GrowMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartTrial}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-main to-lime-500 text-white text-lg font-semibold shadow-xl hover:translate-y-[-2px] transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-main"
            >
              Nhận gói dùng thử ngay
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-10 py-4 rounded-full border-2 border-main text-main text-lg font-semibold hover:bg-main/10 transition"
            >
              Xem lại thông tin gói
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TrialPage

