import { Router } from "express"
import { 
    acceptComplaint,
    completeComplaint,
    createComplaint, 
    deleteAllComplaints, 
    deleteComplaintById, 
    generateComplaintQrCode, 
    getAllClientComplaints, 
    getAllComplaints, 
    getAllDriverAcceptedComplaints, 
    getAllDriverCompletedComplaints, 
    getComplaintById, 
    loginClient
} from "../../controllers/complaints_controller.js"

import multer, { diskStorage } from 'multer';
import Randomstring from "randomstring"
import path from "path";
import { createComplaintQrcode, deleteAllComplaintQrcodes, deleteComplaintQrcodeById } from "../../controllers/complaint_qrcode_controller.js";

const violations_storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/complaints/driver/'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'driver_violation_image_' + Randomstring.generate(10) + path.extname(file.originalname.replace(/\s/g, '')));
    }
});

const complaints_storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/complaints/client/'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'driver_complaint_image_' + Randomstring.generate(10) + path.extname(file.originalname.replace(/\s/g, '')));
    }
});

const complaints_upload = multer({ storage: complaints_storage });
const violations_upload = multer({ storage: violations_storage });

const router = Router()

router.get('/complaints', getAllComplaints)
router.get('/complaints/:id', getComplaintById)
router.get('/complaints/client/:id', getAllClientComplaints)

router.post('/complaints/qrcodes/create', createComplaintQrcode)
router.delete('/complaints/qrcodes/:id', deleteComplaintQrcodeById)
router.delete('/complaints/qrcodes', deleteAllComplaintQrcodes)

router.post('/complaints', complaints_upload.single('complaint'), createComplaint)
router.delete('/complaints', deleteAllComplaints)
router.delete('/complaints/:id', deleteComplaintById)



router.post('/complaints/clients/login', loginClient)

router.post('/complaints/:id/accept', acceptComplaint)
router.post('/complaints/:id/complete', violations_upload.single('violation') ,completeComplaint)

router.get('/complaints/users/:id/accepted', getAllDriverAcceptedComplaints)
router.get('/complaints/users/:id/completed', getAllDriverCompletedComplaints)


export default router