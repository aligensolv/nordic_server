import { Router } from 'express'
const router = Router()

import { createGroup, deleteAllGroups, deleteGroup, getAllGroups, updateGroup } from '../../controllers/group_controller.js'

router.get('/groups', getAllGroups)
router.post('/groups', createGroup)
router.delete('/groups/:id', deleteGroup)
router.delete('/groups', deleteAllGroups)
router.put('/groups/:id', updateGroup)

export default router