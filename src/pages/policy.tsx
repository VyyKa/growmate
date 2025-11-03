import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';

const policySections = [
  { id: 'general-intro', title: 'Giới thiệu chung' },
  { id: 'participants', title: 'Đối tượng tham gia' },
  { id: 'payment-revenue', title: 'Thanh toán và Phân chia doanh thu' },
  { id: 'privacy-camera', title: 'Chính sách bảo mật & camera' },
  { id: 'dispute-resolution', title: 'Giải quyết tranh chấp' },
  { id: 'commitments', title: 'Cam kết từ các bên' },
  { id: 'terms-changes', title: 'Thay đổi điều khoản' },
];

const PolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general-intro');

  const renderContent = () => {
    switch (activeSection) {
      case 'general-intro':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Giới thiệu chung</h2>
              <p className="text-gray-500 mt-1">Tổng quan về nền tảng GrowMate</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg mb-6">
                <p className="text-gray-700 leading-relaxed mb-0">
                  <strong className="text-green-700">GrowMate</strong> là một nền tảng trực tuyến sáng tạo cho phép người dùng nhận nuôi cây ăn trái từ các vườn nông nghiệp sạch, đồng thời theo dõi quá trình chăm sóc và nhận trái cây tận nhà khi đến mùa thu hoạch.
                </p>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg leading-relaxed">
                  Chúng tôi không chỉ kết nối người tiêu dùng với nông dân, mà còn mang đến một hành trình trải nghiệm sống xanh, ý nghĩa và minh bạch.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Lưu ý quan trọng
                  </h3>
                  <p className="text-blue-700">
                    Các chính sách và điều khoản sử dụng này quy định quyền và nghĩa vụ của bạn khi sử dụng dịch vụ của GrowMate. Vui lòng đọc kỹ trước khi sử dụng nền tảng của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case 'participants':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Đối tượng tham gia</h2>
              <p className="text-gray-500 mt-1">Các nhóm người dùng trong hệ sinh thái GrowMate</p>
            </div>
            
            <div className="space-y-8">
              {/* Chủ Nhà Vườn */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">2.1. Chủ Nhà Vườn</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg">Là các cá nhân hoặc tổ chức sở hữu vườn cây và có nhu cầu cung cấp dịch vụ nhận nuôi cây thông qua nền tảng.</p>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-semibold text-green-700 mb-2">Quyền hạn:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span>Được Admin cấp tài khoản (không tự đăng ký)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span>Đăng tải thông tin cây: loại cây, giống, xuất xứ, trọng lượng, thời điểm thu hoạch</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-semibold text-green-700 mb-2">Trách nhiệm:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                        <span>Đảm bảo chất lượng cây</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                        <span>Cung cấp camera giám sát riêng cho từng cây hoặc lô cây</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                        <span>Cập nhật chính xác thông tin và hình ảnh</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Người Dùng */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">2.2. Người Dùng (Người nhận nuôi cây)</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg">Là các khách hàng có nhu cầu nhận nuôi cây để hưởng sản lượng.</p>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-2">Quyền hạn:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Xem danh sách cây đang được nhận nuôi</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Truy cập thông tin chi tiết về từng cây (nông trại, giống, đặc điểm, trọng lượng, thời điểm thu hoạch...)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Truy cập camera trực tiếp để theo dõi cây đã nhận nuôi bất kỳ lúc nào</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-2">Quy trình thanh toán:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">💰</span>
                        <span>Thanh toán trước 20% giá trị đơn hàng</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">💰</span>
                        <span>Phần còn lại được thanh toán sau khi nhận được sản lượng từ cây</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">2.3. Admin (Ban Quản Trị)</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg">Quản lý toàn bộ hệ thống và đảm bảo hoạt động ổn định của nền tảng.</p>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-100">
                    <h4 className="font-semibold text-purple-700 mb-2">Chức năng chính:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">🔧</span>
                        <span>Quản lý toàn bộ hệ thống</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">🔧</span>
                        <span>Xét duyệt và cấp tài khoản cho Chủ Nhà Vườn</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">🔧</span>
                        <span>Xử lý thanh toán và chi trả cho các bên</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-700 mb-2">💰 Hoa hồng:</h4>
                    <p className="text-yellow-700">Admin giữ lại 20% hoa hồng trên mỗi giao dịch thành công.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'payment-revenue':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Thanh toán và Phân chia doanh thu</h2>
              <p className="text-gray-500 mt-1">Quy trình thanh toán và cơ chế phân chia lợi nhuận</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  Quy trình thanh toán
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">1️⃣</span>
                      <p className="text-gray-700">Người Dùng thanh toán qua hệ thống của website.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-500 text-xl">2️⃣</span>
                      <p className="text-gray-700">Số tiền này sẽ được giữ bởi Admin cho đến khi đơn hàng được xác nhận là hoàn tất.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Phân chia doanh thu
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-700">Phí hoa hồng 10% được trừ ra trước khi chuyển tiền cho Chủ Nhà Vườn.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-700">Chủ Nhà Vườn không được thu thêm bất kỳ chi phí nào bên ngoài hệ thống.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'privacy-camera':
        return (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Chính sách bảo mật & camera</h2>
              <p className="text-gray-500 mt-1">Bảo vệ thông tin và quy định sử dụng camera</p>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">4.1. Chính sách bảo mật</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    GrowMate cam kết bảo vệ thông tin cá nhân của người dùng. Mọi dữ liệu cá nhân thu thập được sẽ chỉ được sử dụng cho mục đích cung cấp dịch vụ, cải thiện trải nghiệm người dùng và tuân thủ các quy định pháp luật.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <h4 className="font-semibold text-blue-700 mb-2">Cam kết bảo mật:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Mã hóa dữ liệu nhạy cảm</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Không chia sẻ thông tin với bên thứ ba</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">✓</span>
                        <span>Tuân thủ các quy định pháp luật về bảo vệ dữ liệu</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">4.2. Chính sách camera</h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Để đảm bảo tính minh bạch và cho phép người dùng theo dõi quá trình phát triển của cây, các vườn cây được trang bị hệ thống camera giám sát trực tiếp. Hình ảnh từ camera chỉ được sử dụng cho mục đích giám sát cây trồng.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <h4 className="font-semibold text-green-700 mb-2">Quy định sử dụng camera:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">📹</span>
                        <span>Chỉ giám sát khu vực cây trồng</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">📹</span>
                        <span>Không xâm phạm quyền riêng tư cá nhân</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">📹</span>
                        <span>Dữ liệu được lưu trữ an toàn</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'dispute-resolution':
        return (
          <>
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">⚖️</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Giải quyết tranh chấp</h2>
                <p className="text-gray-500 mt-1">Quy trình xử lý và giải quyết các tranh chấp</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🔄</span>
                  Quy trình giải quyết
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Mọi tranh chấp giữa Người Dùng và Chủ Nhà Vườn sẽ được ưu tiên xử lý thông qua hệ thống hỗ trợ của Admin.
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Các loại tranh chấp
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 text-xl mt-1">🌱</span>
                    <p className="text-gray-700">Tranh chấp về chất lượng cây</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 text-xl mt-1">📦</span>
                    <p className="text-gray-700">Tranh chấp về sản lượng</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 text-xl mt-1">📹</span>
                    <p className="text-gray-700">Tranh chấp về dịch vụ camera</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quyền hạn của Admin
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl mt-1">💰</span>
                    <p className="text-gray-700">Tạm giữ khoản thanh toán</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl mt-1">🔍</span>
                    <p className="text-gray-700">Điều tra và xử lý theo quy định nội bộ</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">📞</span>
                  Liên hệ hỗ trợ
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Để được hỗ trợ nhanh chóng, vui lòng liên hệ với Admin qua hệ thống hỗ trợ của GrowMate.
                </p>
              </div>
            </div>
          </>
        );

      case 'commitments':
        return (
          <>
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">🤝</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Cam kết từ các bên</h2>
                <p className="text-gray-500 mt-1">Trách nhiệm và cam kết của từng bên tham gia</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Chủ Nhà Vườn */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🌱</span>
                  <h3 className="text-xl font-bold text-green-800">Chủ Nhà Vườn</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Cung cấp thông tin và hình ảnh cây chính xác, trung thực.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Cập nhật tình trạng cây thường xuyên trong suốt quá trình nhận nuôi.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Đảm bảo hệ thống camera hoạt động ổn định, giúp người dùng theo dõi được mọi lúc.</p>
                  </div>
                </div>
              </div>

              {/* Người Dùng */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">👤</span>
                  <h3 className="text-xl font-bold text-blue-800">Người Dùng</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Thanh toán đúng hạn theo quy trình (20% trước, phần còn lại sau khi nhận sản lượng).</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Chủ động theo dõi cây qua hệ thống camera được cung cấp.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Chấp nhận điều khoản về việc chia sản lượng, thời điểm thu hoạch và quy trình nhận nuôi.</p>
                  </div>
                </div>
              </div>

              {/* Admin */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">⚙️</span>
                  <h3 className="text-xl font-bold text-purple-800">Admin (Ban Quản Trị)</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Bảo mật thông tin cá nhân và giao dịch của người dùng và chủ nhà vườn.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Vận hành hệ thống ổn định, xử lý kỹ thuật liên quan đến hiển thị, truy cập và giao dịch.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl mt-1">✓</span>
                    <p className="text-gray-700">Hỗ trợ xử lý tranh chấp một cách trung lập và công bằng nếu phát sinh.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'terms-changes':
        return (
          <>
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">📝</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Thay đổi điều khoản</h2>
                <p className="text-gray-500 mt-1">Quyền thay đổi và cập nhật chính sách</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🔄</span>
                  Quyền thay đổi
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Trang web có quyền điều chỉnh, cập nhật chính sách và điều khoản bất kỳ lúc nào. Người dùng sẽ được thông báo qua hệ thống nếu có thay đổi đáng kể.
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <span className="text-yellow-600 text-3xl mt-1">⚠️</span>
                  <div>
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">Lưu ý quan trọng</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Việc bạn tiếp tục sử dụng nền tảng này đồng nghĩa với việc bạn đồng ý với tất cả các chính sách và điều khoản nêu trên.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">📢</span>
                  Thông báo thay đổi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">📧</span>
                    <p className="text-gray-700">Thông báo qua email đăng ký</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">🔔</span>
                    <p className="text-gray-700">Thông báo trên nền tảng</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl mt-1">📱</span>
                    <p className="text-gray-700">Thông báo qua ứng dụng (nếu có)</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chính Sách & Điều Khoản Sử Dụng
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tìm hiểu về các chính sách, điều khoản và cam kết của GrowMate để đảm bảo trải nghiệm tốt nhất cho tất cả người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Mục lục
                </h2>
                <nav className="space-y-2">
                  {policySections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-300 group ${
                        activeSection === section.id
                          ? 'bg-green-50 border-2 border-green-200 text-green-700 shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className={`font-medium ${
                              activeSection === section.id ? 'text-green-700' : 'text-gray-700'
                            }`}>
                              {section.title}
                            </span>
                          </div>
                        </div>
                        {activeSection === section.id && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
