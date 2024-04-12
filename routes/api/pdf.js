import { Router } from 'express'
const router = Router()
import { archieveAllPdfs, deleteAllPdfs, deletePdf } from '../../controllers/pdf_controller.js'

router.delete('/pdfs/:id', deletePdf)
router.delete('/pdfs', deleteAllPdfs)

router.post('/pdfs/archieve', archieveAllPdfs)

export default router