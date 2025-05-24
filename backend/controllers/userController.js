const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcrypt');


//@dec Get all users
//@route GET /api/users
//@access Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({role: 'member'}).select("-password");
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });         
    }}

//@dec Get user by id
//@route GET /api/users/:id
//@access Private 
const getUserById = async (req, res) => {
    try {
        
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