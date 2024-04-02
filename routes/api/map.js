import { Router } from 'express'
const router = Router()
import { createMap, deleteAllMaps, deleteMap, getAllMaps, getMapByZone, updateMap } from '../../controllers/map_controller.js'

router.get('/maps', getAllMaps)

router.get('/maps/zone/:id', getMapByZone)

router.post('/maps', createMap)

router.put('/maps/:id', updateMap)


router.delete('/maps/:id', deleteMap)

router.delete('/maps', deleteAllMaps)


export default router