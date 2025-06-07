const Task = require('../models/Task');

//@dec Get all tasks
//@route GET /api/tasks
//@access Private (Admin: all tasks, Member: assigned tasks)
const getTasks = async (req, res) => {
    try {
        // const tasks = await Task.find(req.user.role === 'admin' ? {} : { assignedTo: req.user._id });
        // res.status(200).json(tasks);

        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find(filter).populate(
                'assignedTo',
                'name email profileImageUrl'
            )
        } else {
            tasks = await Task.find({
                ...filter,
                assignedTo: req.user._id,
            }).populate('assignedTo', 'name email profileImageUrl');
        }

        //add complatedTodoCheckListCount
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoCheckList.filter((item) => item.completed).length;
                return {
                    ...task._doc,
                    completedTodoCount: completedCount,
                }
            })
        )

        //Status Count 
        const allTasks = await Task.countDocuments(
            req.user.role === 'admin' ? {} : { assignedTo: req.user._id }
        )

        const completedTask = await Task.countDocuments({
            ...filter,
            status: 'Completed',
            ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id })
        })

        const pendingTask = await Task.countDocuments({
            ...filter,
            status: 'Pending',
            ...(req.user.role = 'admin' ? {} : { assignedTo: req.user._id })

        })

        const inProgressTask = await Task.countDocuments({
            ...filter,
            status: 'In Progress',
            ...(req.user.role === 'admin' ? {} : { assignedTo: req.user._id })
        })

        res.status(200).json({
            tasks,
            StatusSumary: {
                AllTask: allTasks,
                completedTask,
                pendingTask,
                inProgressTask,

            }
        })


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@dec Get task by id
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server cerror", error: error.message });

    }
}


//@dec Create task
//@route POST /api/tasks
//@access Private (Admin only)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "AssignedTo must be an array of user IDs" });
        }

        const newTask = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createBy: req.user._id,
            attachments,
            todoCheckList: todoCheckList || [],
        });

        res.status(201).json({
            message: "Task created successfully",
            task: newTask,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

//@dec Update task
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.attachments = req.body.attachments || req.attachments;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;


        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: 'assignedTo must be an array of user Ids' })
            }
            task.assignedTo = req.body.assignedTo
        }

        const updateTask = await task.save();

        if (updateTask) {
            res.status(200).json({ message: 'update Task success', updateTask })
        }


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

//@dec Delete task
//@route DELETE /api/tasks/:id
//@access Private (Admin only)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(400).json({ message: 'Task not found' })
        }
        const deleteTask = await task.deleteOne();
        if (deleteTask) {
            return res.status(200).json({ message: `Delete task: ${task.title} success` })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

// @dec Update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(400).json({ message: 'task not found' });
        }

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() == req.user._id.toString()
        )

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(400).json({ message: 'not Authorized' })
        }

        task.status = req.body.status || task.status;

        if (task.status == 'Completed') {
            task.todoCheckList.forEach((completed) => {
                completed.completed = true;
            })
            task.process = 100;
        }

        const updateStatus = await task.save();
        if (updateStatus) {
            return res.status(200).json({ message: `update status task: ${task.title} success`, updateStatus })
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

//@dec Update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskCheckList = async (req, res) => {
    try {
        const { todoCheckList } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        task.todoCheckList = todoCheckList;

        const totalIteams = task.todoCheckList.length;
        const completedItems = task.todoCheckList.filter(item => item.completed).length;
        task.process = totalIteams > 0 ? Math.round((completedItems / totalIteams) * 100) : 0;

        if (task.process === 100) {
            task.status = 'Completed';
        } else if (task > 0) {
            task.status = 'In Progress';
        } else {
            task.status = 'Pending';
        }

        await task.save();

        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo',
            'name email profileImageUrl'
        );
        res.status(200).json({
            message: "Task checklist updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

//dec Get dashboard data
// @route GET /api/tasks/dashboard-data
// @access Private 
const dashboardData = async (req, res) => {
    try {
        const allTasks = await Task.countDocuments();
        const PendingTasks = await Task.countDocuments({ status: 'Pending' });
        const InProgressTasks = await Task.countDocuments({ status: 'In Progress' });
        const OverdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' }
        });

        const StattusTasks = ["Pending", "In Progress", "Completed"]
        const TaskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]
        );

        const TaskDistribution = StattusTasks.reduce((acc, status) => {
            const fomatKey = status.replace(/\s+/g, "")
            acc[fomatKey] = TaskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {})

        TaskDistribution['All'] = allTasks;

        const priorityTasks = ["Low", "Medium", "High"];
        const priorityTasksRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityTasksCount = priorityTasks.reduce((acc, priority) => {
            acc[priority] = priorityTasksRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate assignedTo createBy createdAt updatedAt ");

        res.status(200).json({
            statistics: {
                allTasks,
                PendingTasks,
                InProgressTasks,
                OverdueTasks,

            },
            chartData: {
                TaskDistribution,
                priorityTasksCount
            },
            recentTasks

        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


//@dec Get user dashboard data
// @route GET /api/tasks/user-dashboard-data
// @access Private
const userDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const allTasks = await Task.countDocuments({ assignedTo: userId });
        const PendingTasks = await Task.countDocuments({ assignedTo: userId, status: 'Pending' });
        const InProgressTasks = await Task.countDocuments({ assignedTo: userId, status: 'In Progress' });
        const OverdueTasks = await Task.countDocuments({
            assignedTo: userId,
            dueDate: { $lt: new Date() },
            status: { $ne: 'Completed' }
        });

        const StattusTasks = ["Pending", "In Progress", "Completed"]
        const TaskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]
        );

        const TaskDistribution = StattusTasks.reduce((acc, status) => {
            const fomatKey = status.replace(/\s+/g, "")
            acc[fomatKey] = TaskDistributionRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {})

        TaskDistribution['All'] = allTasks;

        const priorityTasks = ["Low", "Medium", "High"];
        const priorityTasksRaw = await Task.aggregate([
            {
                $match: { assignedTo: userId }
            },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityTasksCount = priorityTasks.reduce((acc, priority) => {
            acc[priority] = priorityTasksRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status dueDate assignedTo createBy");

        res.status(200).json({
            statistics: {
                allTasks,
                PendingTasks,
                InProgressTasks,
                OverdueTasks,

            },
            chartData: {
                TaskDistribution,
                priorityTasksCount
            },
            recentTasks

        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    dashboardData,
    userDashboardData
};