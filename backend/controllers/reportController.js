const Task = require('../models/Task');
const User = require('../models/User');
const excel = require('exceljs');


//@dec Export all tasks report as excel file
//@route GET /api/reports/export/tasks
//@access Private {role: admin}
const exportTasksReport = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('assignedTo', 'name email');
        const workBook = new excel.Workbook();
        const workSheet = workBook.addWorksheet('Tasks Report');

        workSheet.columns = [
            { header: 'Task ID', key: 'taskId', width: 15 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Priority', key: 'priority', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Due Date', key: 'dueDate', width: 20 },
            { header: 'Assigned To', key: 'assignedTo', width: 30 },

        ]

        tasks.forEach(task => {
            assignedTo = task.assignedTo.map((user) => `${user.name} (${user.email})`).join(', ');
            workSheet.addRow({
                taskId: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split('T')[0], // Format date to YYYY-MM-DD
                assignedTo: assignedTo || 'Unassigned',
            });
        })

        res.setHeader(
            "Content type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=\"tasks_report.xlsx\""
        );

        try {
            await workBook.xlsx.write(res);
            res.end();
        } catch (error) {
            res.status(500).json({
                message: "Error exporting tasks",
                error: error.message,
            });
        }

    } catch (error) {
        console.error('Error exporting tasks report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//dec Export user-tasks report as excel file
//@route GET /api/reports/export/users
//@access Private {role: admin}
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTask = await Task.find({}).populate(
            "assignedTo",
            "name email _id"
        )

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTask: 0,
                inProgressTask: 0,
                completedTask: 0
            }
        })

        userTask.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status == "Pending") {
                            userTaskMap[assignedUser._id].pendingTask += 1;
                        } else if (task.status = "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTask += 1;
                        } else if (task.status = "Completed") {
                            userTaskMap[assignedUser._id].completedTask += 1;
                        }
                    }
                })
            }
        })

        const workBook = new excel.Workbook();
        const workSheet = workBook.addWorksheet("User Task Report")


        workSheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total assigned tasks", key: "taskCount", width: 20 },
            { header: "Pending Task", key: "pendingTask", width: 20 },
            { header: "In Progress Task", key: "inProgressTask", width: 20 },
            { header: "Completed Task", key: "inProgressTask", width: 20 },
        ]

    } catch (error) {
        console.error('Error exporting users report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    exportTasksReport,
    exportUsersReport
};