import React from "react";
import avataeDefault from "../../assets/default-avatar.svg";
const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl || avataeDefault}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks?.length || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.completedTasks?.length || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.inProgressTasks?.length || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex items-center gap-1 text-[12px] font-medium ${getStatusTagColor()} px-4 py-1 rounded`}
    >
      <span className="font-semibold">
        {count} <br /> {label}
      </span>
    </div>
  );
};
