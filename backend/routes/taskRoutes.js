const express = require('express');
const {adminOnly, protect} = require('../middlewares/authMiddleware');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,

} = require('../controllers/taskController');

const router = express.Router();


// router.get('/dashboard-data' , protect , DashboardData); // Get dashboard data
// router.get('user-dashboard-data' , protect , UserDashboardData); // Get user dashboard data
router.get('/' ,protect , getTasks); // Get tasks (admin:all , member:assigned)
router.get('/:id', protect, getTaskById); // Get task by id
router.post('/' , protect , adminOnly , createTask); // Create task
router.put('/:id', protect, updateTask); // Update task
router.delete('/:id', protect, adminOnly, deleteTask); // Delete task
router.put('/:id/status' , protect, updateTaskStatus); // Update task status
router.put('/:id/todo' , protect , updateTaskCheckList); // Update task checklist); 


module.exports = router;