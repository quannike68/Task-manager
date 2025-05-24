const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb ) =>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedtypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedtypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg .jpg and .png formats and allowed'), false);
    }
}

const upload = multer({storage , fileFilter});
module.exports = upload;