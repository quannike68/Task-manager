const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcrypt');


//@dec Get all users
//@route GET /api/users
//@access Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({role: 'member'}).select("-password");

        const usersWhithTaskCount = await Promise.all(users.map(async (user) =>{
            const pendingTasks = await Task.find({assignedTo : user._id, status: "Pending"});
            const completedTasks = await Task.find({assignedTo : user._id, status: "Completed"});
            const inProgressTasks = await Task.find({assignedTo : user._id, status: "In Progress"});

            return {
                ...user._doc,
                pendingTasks,
                completedTasks,
                inProgressTasks
            }
        }))

        res.status(200).json(usersWhithTaskCount);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

//@dec Get user by id
//@route GET /api/users/:id
//@access Private 
const getUserById = async (req, res) => {
    try {
        const userById = await User.findById(req.params.id).select("-password");
        if (!userById) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userById);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });            
    }}

//@dec Delete user
//@route DELETE /api/users/:id
//@access Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });            
    }}


module.exports = {
    getAllUsers,
    getUserById,
    deleteUser
}