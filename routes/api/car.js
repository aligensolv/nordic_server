import { Router } from 'express';
import { 
    getAllCars, 
    createNewCar, 
    updateCar, 
    deleteCar, 
    deleteAllCars,
    resetCarKilometers 
} from "../../controllers/car_controller.js";

const router = Router()

router.get('/cars', getAllCars)
router.get('/cars/:id/reset',resetCarKilometers)
router.post('/cars', createNewCar)
router.put('/cars/:id', updateCar)
router.delete('/cars/:id', deleteCar)
router.delete('/cars', deleteAllCars)

export default router