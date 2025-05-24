import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-3xl text-blue-600 dark:text-blue-400 lg:text-6xl">
            404
          </h1>

          <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-white md:text-3xl">
            <span className="text-red-500 dark:text-red-400">Có lỗi xảy
            ra</span>
          </h6>

          <p className="mb-4 text-center text-gray-500 dark:text-gray-300 md:text-lg">
            Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>

          <Link
            to="/"
            className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700 dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
