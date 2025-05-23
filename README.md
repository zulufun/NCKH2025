# NCKH2025
Chương trình demo cho NCKH2025 thu thập thông tin hệ thống mạng

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [License](#license)


## Cấu trúc dự án

```bash
NCKH2025/
├── extention/                      # Thư mục chứa mã nguồn của extension
│   ├── manifest.json               # Tệp cấu hình chính của extension
│   ├── background.js               # Tập lệnh nền chạy khi extension được kích hoạt
│   ├── content.js                  # Tập lệnh nội dung, chạy trên các trang web được chỉ định
│   ├── icons/
│   │   ├── icon16.png              # Biểu tượng của extension (16x16)
│   │   ├── icon48.png              # Biểu tượng của extension (48x48)
│   │   └── icon128.png             # Biểu tượng của extension (128x128)
│   ├── popup/
│   │   ├── popup.html              # Giao diện HTML của cửa sổ popup
│   │   ├── popup.js                # Tập lệnh cho cửa sổ popup
│   │   └── popup.css               # Định dạng CSS cho cửa sổ popup
│   ├── styles/
│       └── content.css             # Định dạng CSS cho các tập lệnh nội dung
│
├── nckh-be/                        # Thư mục chứa mã nguồn backend
│   ├── app/
│   │   ├── __init__.py             # Tệp khởi tạo package Python
│   │   ├── main.py                 # Tập lệnh chính cho backend
│   │   ├── routers/                # Thư mục chứa các routers
│   │   │   ├── __init__.py         # Tệp khởi tạo package Python cho routers
│   │   │   ├── control.py          # Router điều khiển
│   │   │   ├── websocket.py        # Router cho WebSocket
│   │   ├── services/               # Thư mục chứa các service của ứng dụng
│   │       ├── __init__.py         # Tệp khởi tạo package Python cho services
│   │       ├── packet_capture.py   # Dịch vụ bắt gói tin
│   ├── requirements.txt            # Danh sách các thư viện Python cần cài đặt
│
├── nckh-fe/                        # Thư mục chứa mã nguồn frontend
│   ├── node_modules/               # Thư mục chứa các module của Node.js
│   ├── public/                     # Thư mục chứa các tài nguyên tĩnh như hình ảnh và index.html
│   ├── src/                        # Thư mục chứa mã nguồn React
│   │   ├── assets/                 # Thư mục chứa tài nguyên (ảnh, biểu tượng)
│   │   ├── components/             # Thư mục chứa các component dùng chung trong ứng dụng
│   │   ├── const/                  # Thư mục chứa các hằng số sử dụng trong ứng dụng
│   │   ├── context/                # Thư mục chứa các context cho Context API
│   │   ├── layouts/                # Thư mục chứa các bố cục trang
│   │   ├── pages/                  # Thư mục chứa các trang chính
│   │   │   ├── aichatbox/          # Thư mục chứa trang liên quan đến AI Chatbox
│   │   │   ├── auth/               # Thư mục chứa trang đăng nhập, đăng ký
│   │   │   ├── error-page/         # Thư mục chứa trang lỗi
│   │   │   ├── not-found/          # Thư mục chứa trang 404
│   │   │   ├── thong-ke-time/      # Thư mục chứa trang thống kê thời gian
│   │   │   ├── thu-thap-packet/    # Thư mục chứa trang thu thập gói tin
│   │   ├── redux/                  # Thư mục chứa các tập tin liên quan đến Redux
│   │   ├── services/               # Thư mục chứa các service để gọi API
│   │   ├── utils/                  # Thư mục chứa các hàm tiện ích
│   │   ├── App.css                 # CSS chính cho ứng dụng
│   │   ├── App.tsx                 # Thành phần chính của ứng dụng React
│   │   ├── index.tsx               # Điểm vào chính của ứng dụng React
│   │   ├── global.d.ts             # Cấu hình global cho TypeScript
│   ├── Dockerfile                  # Dockerfile để tạo Docker image cho frontend
│   ├── package.json                # Thông tin về dự án và các dependencies
│   ├── package-lock.json           # Tệp khóa phiên bản các package đã cài đặt
│   ├── tsconfig.json               # Cấu hình TypeScript cho dự án
│
├── LaydataIP.py                    # Tập lệnh Python để xử lý dữ liệu IP
├── server.py                       # Tập lệnh khởi động server
├── test.py                         # Tập lệnh kiểm tra
└── README.md                       # Tài liệu hướng dẫn chung cho dự án


Hướng dẫn cài đặt và chạy dự án
Backend (nckh-be)
Cài đặt môi trường ảo và các thư viện cần thiết:


python3 -m venv venv
source venv/bin/activate  # Trên Linux/MacOS
.\venv\Scripts\activate    # Trên Windows
pip install -r requirements.txt
Chạy server backend:


uvicorn app.main:app --reload
Frontend (nckh-fe)
Cài đặt các gói cần thiết:


npm install
Chạy ứng dụng frontend:


npm start
Cấu trúc dự án
nckh-be/app: Thư mục chứa mã nguồn backend sử dụng FastAPI.

__init__.py: Khởi tạo module Python.
main.py: Điểm vào chính cho ứng dụng FastAPI.
routers/: Thư mục chứa các tệp điều khiển WebSocket và các API khác.
control.py: Điều khiển các API quản lý trạng thái dữ liệu.
websocket.py: Xử lý các kết nối WebSocket.
services/: Thư mục chứa các dịch vụ logic ứng dụng.
packet_capture.py: Mã dịch vụ để bắt và xử lý gói tin.
nckh-fe/: Thư mục chứa mã nguồn frontend sử dụng ReactJS.

node_modules/: Thư mục chứa các thư viện Node.js cần thiết.
public/: Thư mục chứa các tệp tĩnh.
src/: Thư mục chứa mã nguồn ReactJS.
.gitignore: Tệp cấu hình để bỏ qua các tệp/thư mục không cần theo dõi trong Git.
Dockerfile: Tệp cấu hình để đóng gói frontend trong container Docker.
package.json: Tệp khai báo các gói cần thiết cho dự án frontend.
package-lock.json: Tệp khóa phiên bản các gói cho dự án frontend.
README.md: Hướng dẫn chi tiết cho dự án frontend.
tsconfig.json: Cấu hình TypeScript cho dự án frontend.
############################################
## MỘT SỐ LƯU Ý QUAN TRỌNG
-- CÓ thể lên chat GPT để coi cách cài extensions -> Nếu có thời gian thì hãy viết cụ thể hơn vào extension
-- Database về IP nặng k push lên git được nên liên hệ để app chạy full chức năng
-- Chưa fix được một số bug bên BE về baất đồng bộ và connect , end khi làm việc bên BE -> chưa tìm ra giải pháp
