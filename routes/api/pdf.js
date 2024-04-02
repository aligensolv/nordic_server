import { Router } from 'express'
const router = Router()
import { deleteAllPdfs, deletePdf } from '../../controllers/pdf_controller.js'

router.delete('/pdfs/:id', deletePdf)
router.delete('/pdfs', deleteAllPdfs)

export default router