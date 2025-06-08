import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axioslnstance";
import { PRIORITY_DATA } from "../../utils/data";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import moment from "moment";
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  console.log("Task ID from state:", taskId);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrenttask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opentDeleteAlert, setOpentDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  //CreateTask
  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoCheckList.map((item) => ({
        text: item,
        completed: false,
      }));

      const res = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todoList,
      });
      if (res.data) {
        toast.success("Task created successfully.");
        clearData();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  //UpdateTask
  const updateTask = async () => {};

  const handleSupmit = async () => {
    if (!taskData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!taskData.dueDate) {
      toast.error("Due date is required.");
      return;
    }

    if (taskData.assignedTo?.length === 0) {
      toast.error("Task not assigned to any member");
      return;
    }
    if (taskData.todoCheckList?.length == 0) {
      toast.error("Add atleast one todo task");
      return;
    }
    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  //Get info task by ID
  const getTaskDetailsById = async () => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (res.data) {
        const task = res.data;
        setCurrenttask(task);
        setTaskData((prev) => ({
          ...prev,
          title: task.title,
          description: task.description,
          priority: task.priority,
          dueDate: task.dueDate
            ? moment(task.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: task?.assignedTo?.map((item) => item?._id) || [],
          todoCheckList: task.todoCheckList?.map((item) => item?.text) || [],
          attachments: task.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  //Delete task
  const DeleteTask = async () => {};

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById();
    }
  }, [taskId]);
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex justify-center items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpentDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2 justify-center items-start">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData?.dueDate?.slice(0, 10) || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-4 md:col-span-3 items-center">
                <label className="text-xs font-medium">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                To-Do Checklist
              </label>

              <TodoListInput
                todoList={taskData.todoCheckList}
                setTodoList={(value) => {
                  handleValueChange("todoCheckList", value);
                }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            <div className="flex justify-end mt-7">
              <button className="add-btn" onClick={handleSupmit}>
                {taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
