import { Router } from 'express'
const router = Router()


import { 
  getAllAccidents, 
  createAccident, 
  deleteAllAccidents, 
  deleteAccidentById 
} from '../../controllers/accident_controller.js'

router.get('/accidents', getAllAccidents);
router.post('/accidents', createAccident);
router.delete('/accidents', deleteAllAccidents);
router.delete('/accidents/:id', deleteAccidentById);

export default router