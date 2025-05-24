const express = require("express");
const { adminOnly } = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, deleteUser } = require("../controllers/userController");
const { protect  , adminOnly} = require("../middlewares/authMiddleware");


const router = express.Router();

router.get("/" , protect , adminOnly , getAllUsers);   // Get all users(admin)
router.get("/:id" , protect , getUserById); // Get user by id
router.delete("/:id" , protect , adminOnly , deleteUser); // Delete user by id

module.exports = router;