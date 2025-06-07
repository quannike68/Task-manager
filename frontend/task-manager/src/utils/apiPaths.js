export const BASE_URL = "http://localhost:8000"

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", //register a new user(Admin or Member) 
        LOGIN: "/api/auth/login",//Authenticatate user & return JWT token
        GET_PROFILE: "/api/auth/profile", //get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Lấy tất cả người dùng (chỉ Admin)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Lấy người dùng theo ID
        CREATE_USER: "/api/users", // Tạo người dùng mới (chỉ Admin)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Cập nhật thông tin người dùng
        DELETE_USER: (userId) => `/api/users/${userId}`, // Xoá người dùng
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Lấy dữ liệu bảng điều khiển (admin)
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Lấy dữ liệu bảng điều khiển người dùng
        GET_ALL_TASKS: "/api/tasks", // Lấy tất cả công việc (Admin: tất cả, User: công việc được giao)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Lấy công việc theo ID
        CREATE_TASK: "/api/tasks", // Tạo công việc mới (chỉ Admin)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Cập nhật chi tiết công việc
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Xoá công việc

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Cập nhật trạng thái công việc
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Cập nhật danh sách việc cần làm
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Xuất tất cả công việc thành file Excel
        EXPORT_USERS: "/api/reports/export/users", // Xuất báo cáo người dùng và công việc
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image"
    }
}