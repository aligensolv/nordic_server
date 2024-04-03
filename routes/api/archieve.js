import { Router } from "express"
import { getAllArchives, getArchiveById, storeArchieve } from "../../controllers/archieve_controller.js"

const router = Router()

router.get('/archieves', getAllArchives)

router.get('/archieves/:id', getArchiveById)

router.post('/archieves', storeArchieve)

export default router