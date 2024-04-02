import { Router } from 'express';
import { getAllLocations, createLocation, updateLocation, deleteLocation, deleteAllLocations } from "../../controllers/location_controller.js";
const router = Router()

router.get('/locations', getAllLocations)
router.post('/locations', createLocation)
router.put('/locations/:id', updateLocation)
router.delete('/locations/:id', deleteLocation)
router.delete('/locations', deleteAllLocations)

export default router