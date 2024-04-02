import {Router} from 'express'
import uiAsyncWrapper from '../../middlewares/front_async_wrapper.js'
import { OK } from '../../constants/status_codes.js'
import ComplaintRepository from '../../repositories/Complaint.js'
import ComplaintQrcodeRepository from '../../repositories/ComplaintQrcode.js'

const router = Router()


router.get('/complaints', uiAsyncWrapper(
    async (req,res) =>{
        const complaints = await ComplaintRepository.getAllComplaints()
        return res.status(OK).render('complaints/index', {
            complaints
        })
    }
))
router.get('/complaints/qrcodes', uiAsyncWrapper(
    async (req,res) =>{
        const complaints_qrcodes = await ComplaintQrcodeRepository.getAllComplaintQrcodes()
        return res.status(OK).render('complaints/qrcodes/index', {
            complaints_qrcodes
        })
    }
))

router.get('/complaints/:id', uiAsyncWrapper(
    async (req,res) =>{
        return res.status(OK).render('complaints/view_complaint')
    }
))



router.get('/complaints/qrcodes/create', uiAsyncWrapper(
    async (req,res) =>{
        return res.status(OK).render('complaints/qrcodes/create')
    }
))


router.get('/complaints/qrcodes/:id', uiAsyncWrapper(
    async (req,res) =>{
        const complaint_qrcode = await ComplaintQrcodeRepository.getComplaintQrcodeById(req.params.id)
        return res.status(OK).render('complaints/qrcodes/view', {
            complaint_qrcode
        })
    }
))




export default router