import { Router } from "express"
import ArchieveRepository from "../../repositories/Archieve.js"

const router = Router()



router.get('/archieves', async (req, res) => {

    const pdfs = await ArchieveRepository.getAllArchives({})
    res.render('pdfArchieve/pdf_list', {
        pdfs
    })
})

router.get('/archieves/:id', async (req, res) => {
    const archieve = await ArchieveRepository.getArchiveById(req.params.id)
    res.render('pdfArchieve/pdf_show', {
        archieve
    })
});


export default router