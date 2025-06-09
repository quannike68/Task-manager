import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioslnstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "sonner";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
const MyTask = () => {
  const [allTask, setAlltask] = useState([]);
  console.log("All tasks:", allTask);

  const [tabs, setTabs] = useState([]);
  const [fillterStatus, setFillterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: fillterStatus === "All" ? "" : fillterStatus,
        },
      });

      setAlltask(res.data?.tasks?.length > 0 ? res.data.tasks : []);

      const statusSummary = res.data?.StatusSumary || {};

      const statusArray = [
        { label: "All", count: statusSummary.AllTask || 0 },
        { label: "Pending", count: statusSummary.pendingTask || 0 },
        { label: "In Progress", count: statusSummary.inProgressTask || 0 },
        { label: "Completed", count: statusSummary.completedTask || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again later.");
    }
  };

  const handleClick = (taskData) => {
    navigate(`/user/task-details/${taskData}`);
  };

  useEffect(() => {
    getAllTasks();
  }, [fillterStatus]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={fillterStatus}
                setActiveTab={setFillterStatus}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTask?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map(
                (person) => person.profileImageUrl
              )}
              attachmentCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              todoChecklist={item.todoCheckList || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyTask;
