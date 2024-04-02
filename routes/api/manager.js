    import { Router } from 'express'
const router = Router()

import { createManager, deleteAllManagers, deleteManagerById, getAllManagers, getManagerById, loginTechnician, updateManager } from '../../controllers/manager_controller.js'

router.post('/managers', createManager)
router.post('/managers/technicians/login', loginTechnician)

router.delete('/managers/:id', deleteManagerById)
router.delete('/managers', deleteAllManagers)


router.put('/managers/:id', updateManager)

router.get('/manager', getAllManagers)
router.get('/managers/:id', getManagerById)

export default router