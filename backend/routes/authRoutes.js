const express = require("express");
const { registerUser, LoginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require ("../middlewares/uploadMiddleware");
const router = express.Router();



router.post("/register" , registerUser);
router.post("/login" , LoginUser);
router.get("/profile",protect, getUserProfile);
router.put("/profile",protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Server error"  , error: error.message });
        
    }
})

module.exports = router;