# AI Admin frontend

Next.js/React frontend cho hệ thống DAG, RAG và TAG. Xem [hướng dẫn cấu hình và vận hành toàn hệ thống](../README.md) trước khi chạy.

1. `npm ci`
2. Tạo `.env.local` từ `.env.example`; dùng địa chỉ mà trình duyệt truy cập được.
3. Khởi động các backend đã cấu hình xác thực, sau đó chạy `npm run dev`.
4. Kiểm tra bằng `npm run lint` và `npm run build`.

Frontend không còn tài khoản bypass. Đăng nhập dùng tài khoản đã cấu hình ở `user_server`. Trang nhân sự hiện là dữ liệu minh họa, chưa kết nối hệ thống HR.
