import { Router } from 'express'
const router = Router()

import { activateMachine, createMachine, deleteAllMachines, deleteMachine, getAllMachines, getMachineById, updateMachine } from '../../controllers/machine_controller.js'


router.get('/machines', getAllMachines)

router.get('/machines/:id', getMachineById)


router.post('/machines', createMachine)

router.put('/machines/:id', updateMachine )

router.delete('/machines/:id', deleteMachine )

router.delete('/machines', deleteAllMachines)

router.post('/machines/:id/activate', activateMachine)

export default router