## Task Manager – MERN Fullstack Project

Task Manager là ứng dụng quản lý công việc (task tracking) được xây dựng theo mô hình MERN Stack (MongoDB – Express – React – Node.js).
Hệ thống hỗ trợ quản lý công việc, người dùng, upload file, thống kê, xuất Excel… phù hợp cho cá nhân hoặc nhóm.


## ✨ Tính năng chính của dự án
### 👤 Authentication

Đăng ký, đăng nhập bằng JWT

Hash mật khẩu với bcrypt

Bảo vệ route bằng middleware

### 📝 Task Manager

Tạo, cập nhật, xoá, lọc, tìm kiếm Task

Phân loại theo tiến độ, trạng thái

Thống kê bằng bảng, biểu đồ Recharts

### 📁 Upload File

Upload ảnh tài liệu bằng Multer

Lưu trữ Cloudinary

### 📊 Xuất Excel

Xuất danh sách Task thành file .xlsx bằng ExcelJS

### 🌐 UI/UX

TailwindCSS 4

Thông báo realtime Sonner

Giao diện tối giản, mượt


### 📂 Tổng quan thư mục
project/
 ├── backend/      # API, database, xác thực, upload
 └── frontend/     # giao diện React + Vite



## 🖥️ Backend
<p align="center">
  <strong><span style="font-size: 24px;">🔥Công nghệ sử dụng 🔥</span></strong>
</p>

#### Node.js / Express 5

#### MongoDB + Mongoose

#### JWT (jsonwebtoken) – xác thực người dùng

#### bcrypt / bcryptjs – mã hoá mật khẩu

#### Cloudinary + multer-storage-cloudinary – upload ảnh/file

#### multer – xử lý upload

#### dotenv – quản lý biến môi trường

#### ExcelJS – xuất file Excel

#### CORS – kết nối FE – BE

#### nodemon – chạy dev



## 🌐 Frontend
<p align="center">
  <strong><span style="font-size: 24px;">🔥Công nghệ sử dụng 🔥</span></strong>
</p>

#### React 19

#### React Router DOM v7 – điều hướng

#### Axios – gọi API

#### TailwindCSS 4 – giao diện

#### Recharts – biểu đồ thống kê công việc

#### Sonner – toast thông báo

#### Vite 6 – build / chạy dự án


### End!