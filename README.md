# SmartBiz AI Admin Dashboard (Next.js + Ant Design + React Query)

Dashboard frontend admin (Next.js App Router, TypeScript) cho hệ thống quản lý doanh nghiệp tích hợp AI:
- **RAG** (Retrieval Augmented Generation): hiển thị evidence chunks
- **DAG** (Data Augmented Generation): augment dữ liệu, hiển thị augmented items
- **TAG** (Tool Augmented Generation): cấu hình tools và hiển thị tool calls

## 1) Yêu cầu
- Node.js LTS (khuyến nghị >= 20)
- Backend FastAPI chạy tại `http://localhost:8000`

## 2) Setup
```bash
npm install
```

Copy env:
```bash
cp .env.example .env.local
```

## 3) Chạy dev
```bash
npm run dev
```
Mở: `http://localhost:3000`

## 4) Test user (bypass login)
- Email: `admin@demo.local`
- Password: `Admin@123`

Bypass bật mặc định qua biến:
- `NEXT_PUBLIC_ENABLE_TEST_BYPASS=true`

## 5) Env / cấu hình
Frontend gọi backend bằng `NEXT_PUBLIC_API_BASE_URL`.
Ngoài ra có sẵn placeholders cho Supabase (nếu bạn muốn dùng về sau).

## 6) Backend endpoints kỳ vọng (gợi ý)
Frontend đang gọi (nếu backend có):
- `POST /auth/login` -> `{ access_token, user }`
- `GET /auth/me` -> `user`
- `GET /metrics`
- `POST /rag_query` body: `{ query, rag, dag, tag }`
- `POST /upload_file` (multipart: file)
- `GET /structured_data`
- `POST /dag_augment`
- `GET /tools`
- `POST /tools`
- `POST /tools/test`
- `GET /reports`

Nếu backend chưa có một endpoint, UI vẫn chạy với **mock data** (placeholderData của React Query).

## 7) Notes
- JWT đang lưu ở `localStorage` để demo. Production nên chuyển sang httpOnly cookie.
- Ant Design SSR trong App Router đã tích hợp `@ant-design/nextjs-registry` theo hướng dẫn chính thức.
