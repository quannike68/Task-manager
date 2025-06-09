import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axioslnstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import { toast } from "sonner";
const ManageUsers = () => {
  const [allUser, setAllUser] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const getAllUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (res.data?.length > 0) {
        setAllUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading user report:", error);
      toast.error("Failed to download user report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <DashboardLayout activeMenu="Team members">
      <div className="mt-5 mb-10">
        <div className="flex md: flex-row md: items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
            disabled={isDownloading}
          >
            <LuFileSpreadsheet className="text-lg" />
            {isDownloading ? "Downloading..." : "Download Report"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {allUser?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
