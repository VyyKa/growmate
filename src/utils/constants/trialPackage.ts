export const TRIAL_DURATION_DAYS = 3

export const TRIAL_PACKAGE_INFO = {
  listingId: 9999,
  treeId: 9999,
  treeName: "Cây Dùng Thử",
  farmerId: 0,
  farmerName: "GrowMate System",
  pricePerYear: 0,
  durationText: `${TRIAL_DURATION_DAYS} ngày trải nghiệm`,
  description:
    "Gói trải nghiệm miễn phí giúp bạn làm quen với quy trình theo dõi, chăm sóc và nhận thông báo từ GrowMate trước khi quyết định mua gói thật.",
  image:
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=600&auto=format&fit=crop",
  perks: [
    "Truy cập dashboard theo dõi sức khỏe cây",
    "Nhận báo cáo tự động hằng ngày",
    "Nhật ký ảnh và video timelapse",
    "Tin nhắn mô phỏng từ nông trại",
  ],
}

export type TrialPackagePayload = typeof TRIAL_PACKAGE_INFO

