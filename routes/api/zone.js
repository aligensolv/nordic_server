import { Router } from 'express'
const router = Router()


import { createZone, deleteAllZones, deleteZone, getAllZones, updateZone } from '../../controllers/zone_controller.js'

router.get('/zones', getAllZones)

router.post('/zones', createZone)

router.put('/zones/:id', updateZone)

router.delete('/zones/:id', deleteZone)

router.delete('/zones', deleteAllZones)


export default router