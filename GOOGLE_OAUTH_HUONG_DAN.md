# Hướng dẫn tích hợp Google OAuth Login - Đã hoàn thành

## Tổng quan

Chức năng đăng nhập với Google đã được tích hợp hoàn chỉnh. Backend sẽ redirect về FE với `?token=...`, và FE sẽ tự động xử lý token, lấy thông tin user, và đăng nhập.

## Luồng hoạt động

1. **User click nút "Login with Google"** → `GoogleLoginButton.tsx` redirect đến `/api/auth/login-google`
2. **Backend xử lý OAuth** → Google xác thực → Backend tạo JWT token
3. **Backend redirect về FE** → `https://www.growmate.site/google-callback?token=...` (đã sửa từ `/googleCallback` thành `/google-callback` để khớp với route FE)
4. **FE xử lý callback** → `googleCallback.tsx`:
   - Đọc token từ query params
   - Decode JWT để lấy userId
   - Gọi API `/api/users?id={userId}` để lấy user info
   - Lưu token và user vào Redux + localStorage
   - Xóa query params khỏi URL
   - Navigate về trang chủ

## Các file đã được sửa/cập nhật

### 1. `src/services/axiosClient.ts`
**Thay đổi:**
- Đọc token từ `localStorage` khi khởi tạo module
- `setAuthToken()` bây giờ tự động lưu/xóa token trong `localStorage`

**Lý do:** Đảm bảo token được persist qua các lần reload trang, và axios luôn có token sẵn sàng.

### 2. `src/utils/helpers/jwtHelpers.ts` (MỚI)
**Chức năng:**
- `decodeJWT(token)`: Decode JWT token để lấy payload (không verify signature)
- `getUserIdFromToken(token)`: Lấy userId từ claim `sub` trong JWT

**Lý do:** Cần userId để gọi API lấy user info sau khi nhận token từ Google OAuth.

### 3. `src/pages/googleCallback.tsx`
**Thay đổi lớn:**
- Đọc `Token` hoặc `token` từ query params (hỗ trợ cả 2 kiểu)
- Decode JWT để lấy userId
- Gọi API `/api/users?id={userId}` để lấy user info
- Lưu token và user vào Redux (tự động lưu vào localStorage)
- Xóa query params khỏi URL
- Navigate về trang chủ với `replace: true`

**Lý do:** Backend chỉ trả về token, không trả về user info. FE cần tự fetch user info sau khi có token.

## Các file không cần sửa (đã đúng)

### `src/components/GoogleLoginButton.tsx`
- Đã đúng: redirect đến `/api/auth/login-google` bằng `window.location.href`
- Không cần thay đổi gì

### `src/router/AppRouter.tsx`
- Đã có route `/google-callback` trỏ đến `GoogleCallback` component
- Không cần thay đổi gì

### `src/store/slices/authSlice.ts`
- Đã có `setCredentials()` để lưu user + token vào Redux và localStorage
- Không cần thay đổi gì

## Kiểm tra hoạt động

### Test trên localhost:
1. Đảm bảo Backend redirect về `http://localhost:5173/google-callback?token=...` (hoặc port FE của bạn)
2. Click nút "Login with Google"
3. Sau khi Google xác thực, sẽ redirect về `/google-callback`
4. Kiểm tra:
   - Token được lưu trong `localStorage` (key: `auth_token`)
   - User info được lưu trong Redux store
   - URL được clean (không còn query params)
   - Navigate về trang chủ thành công

### Test trên production:
1. Backend hiện redirect về `https://www.growmate.site/google-callback?token=...`
2. Đảm bảo domain FE khớp với domain trong redirect URL của Backend
3. Nếu FE deploy ở domain khác, cần sửa redirect URL trong Backend (`AuthenticationController.cs`)

## Lưu ý quan trọng

1. **Google Cloud Console:**
   - Authorized redirect URIs phải có: `https://growmate.azurewebsites.net/api/auth/google-callback`
   - Nếu thay đổi domain, cần cập nhật cả Google Cloud Console

2. **Backend redirect URL:**
   - Hiện tại: `https://www.growmate.site/google-callback?token=...`
   - Nếu FE deploy ở domain khác, cần sửa trong `AuthenticationController.cs` → `GoogleCallback()` method

3. **Token storage:**
   - Token được lưu ở 2 nơi:
     - `localStorage` (key: `auth_token`) - cho axios client
     - Redux store (key: `auth.token`) - cho app state
   - Khi logout, cả 2 đều được xóa

4. **JWT decoding:**
   - `jwtHelpers.ts` chỉ decode token, KHÔNG verify signature
   - Signature verification được xử lý bởi Backend khi gọi API
   - Nếu token bị tamper, API sẽ trả về 401 Unauthorized

## Troubleshooting

### Lỗi: "Không nhận được token từ Google"
- **Nguyên nhân:** Backend không redirect về đúng URL hoặc không có token trong query
- **Giải pháp:** Kiểm tra Backend redirect URL và đảm bảo có `?token=...` trong URL

### Lỗi: "Không thể lấy thông tin user từ token"
- **Nguyên nhân:** JWT token không có claim `sub` hoặc `sub` không phải là số
- **Giải pháp:** Kiểm tra Backend tạo JWT có đúng format không

### Lỗi: "Không tìm thấy thông tin user"
- **Nguyên nhân:** API `/api/users?id={userId}` trả về lỗi hoặc không tìm thấy user
- **Giải pháp:** Kiểm tra:
  - Token có hợp lệ không (có thể hết hạn)
  - User có tồn tại trong database không
  - API có trả về đúng format không

### Token không được lưu vào localStorage
- **Nguyên nhân:** Browser chặn localStorage (private mode, hoặc bị disable)
- **Giải pháp:** Kiểm tra browser settings, hoặc thử trên browser khác

## Kết luận

Tất cả code đã được cập nhật và sẵn sàng sử dụng. Chỉ cần đảm bảo:
1. Backend redirect về đúng domain của FE
2. Google Cloud Console có đúng redirect URI
3. Test kỹ trên cả localhost và production

Nếu có vấn đề, kiểm tra console log và network tab trong DevTools để debug.

