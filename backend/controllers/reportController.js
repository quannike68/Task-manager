const Task = require("../models/Task");
const User = require("../models/User");
const excel = require("exceljs");

//@dec Export all tasks report as excel file
//@route GET /api/reports/export/tasks
//@access Private {role: admin}
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("assignedTo", "name email");

    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet("Tasks Report");

    // Hàm tính chiều rộng cột dựa trên dữ liệu
    function calculateColumnWidths(tasks) {
      const maxLengths = {
        taskId: "Task ID".length,
        title: "Title".length,
        description: "Description".length,
        priority: "Priority".length,
        status: "Status".length,
        dueDate: "Due Date".length,
        assignedTo: "Assigned To".length,
      };

      tasks.forEach((task) => {
        maxLengths.taskId = Math.max(
          maxLengths.taskId,
          String(task._id).length
        );
        maxLengths.title = Math.max(maxLengths.title, task.title.length);
        maxLengths.description = Math.max(
          maxLengths.description,
          task.description.length
        );
        maxLengths.priority = Math.max(
          maxLengths.priority,
          task.priority.length
        );
        maxLengths.status = Math.max(maxLengths.status, task.status.length);
        maxLengths.dueDate = Math.max(
          maxLengths.dueDate,
          task.dueDate ? task.dueDate.toISOString().split("T")[0].length : 0
        );

        const assignedToText =
          Array.isArray(task.assignedTo) && task.assignedTo.length > 0
            ? task.assignedTo.map((u) => `${u.name} (${u.email})`).join("\n")
            : "Unassigned";

        assignedToText.split("\n").forEach((line) => {
          maxLengths.assignedTo = Math.max(maxLengths.assignedTo, line.length);
        });
      });

      return [
        { header: "Task ID", key: "taskId", width: maxLengths.taskId + 2 },
        { header: "Title", key: "title", width: maxLengths.title + 2 },
        {
          header: "Description",
          key: "description",
          width: maxLengths.description + 2,
        },
        { header: "Priority", key: "priority", width: maxLengths.priority + 2 },
        { header: "Status", key: "status", width: maxLengths.status + 2 },
        { header: "Due Date", key: "dueDate", width: maxLengths.dueDate + 2 },
        {
          header: "Assigned To",
          key: "assignedTo",
          width: maxLengths.assignedTo + 2,
        },
      ];
    }

    // Set columns with auto width
    workSheet.columns = calculateColumnWidths(tasks);

    // Add rows
    tasks.forEach((task) => {
      const assignedTo =
        Array.isArray(task.assignedTo) && task.assignedTo.length > 0
          ? task.assignedTo
              .map((user) => `${user.name} (${user.email})`)
              .join("\n")
          : "Unassigned";

      const row = workSheet.addRow({
        taskId: task._id.toString(),
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "",
        assignedTo,
      });

      // Bật wrap text cho ô Assigned To
      row.getCell("assignedTo").alignment = { wrapText: true };
    });

    // Đặt header response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );

    await workBook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting tasks report:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//dec Export user-tasks report as excel file
//@route GET /api/reports/export/users
//@access Private {role: admin}
const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("name email _id").lean();
    const userTask = await Task.find({}).populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTask: 0,
        inProgressTask: 0,
        completedTask: 0,
      };
    });

    userTask.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          const userStats = userTaskMap[assignedUser._id];
          if (userStats) {
            userStats.taskCount += 1;
            if (task.status === "Pending") {
              userStats.pendingTask += 1;
            } else if (task.status === "In Progress") {
              userStats.inProgressTask += 1;
            } else if (task.status === "Completed") {
              userStats.completedTask += 1;
            }
          }
        });
      }
    });

    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet("User Task Report");

    workSheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
      { header: "Pending Task", key: "pendingTask", width: 20 },
      { header: "In Progress Task", key: "inProgressTask", width: 20 },
      { header: "Completed Task", key: "completedTask", width: 20 },
    ];

    workSheet.addRows(Object.values(userTaskMap));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=user_report.xlsx"
    );

    await workBook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting users report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  exportTasksReport,
  exportUsersReport,
};
