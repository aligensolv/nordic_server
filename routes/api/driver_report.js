import { Router } from 'express';
import { createNewDriver } from "../../controllers/driver_report_controller.js";
const router = Router()

import multer, { diskStorage } from 'multer';
import path from 'path';
import Randomstring from 'randomstring'

// Set up multer
const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/drivers/'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'driver_profile_' + Randomstring.generate(10) + path.extname(file.originalname.replace(/\s/g, '')));
    }
});

const upload = multer({ storage: storage });

router.post('/drivers',upload.any(), createNewDriver)

export default router