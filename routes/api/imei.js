import { Router } from 'express'
const router = Router()

import { 
  createImei, 
  deleteAllImeis, 
  deleteImei, 
  getAllImeis, 
  getImeiById, 
  updateImei
} from '../../controllers/imei_controller.js'

router.get('/imeis', getAllImeis)

router.get('/imeis/:id', getImeiById)

router.post('/imeis', createImei)

router.put('/imeis/:id',  updateImei)

router.delete('/imeis/:id', deleteImei)

router.delete('/imeis', deleteAllImeis)


export default router