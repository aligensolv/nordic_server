import { Router } from 'express'
import { getTotalRemovedViolationsCount, getUserRemovedViolationsCount, getUserViolations, getViolationById, getViolationCount } from '../../controllers/violation_controller.js'
const router = Router()

router.get('/violations/count', getViolationCount)
router.get('/violations/removed/count', getTotalRemovedViolationsCount)

router.get('/violations/:id', getViolationById)


router.get('/violations/users/:id', getUserViolations)

router.get('/violations/users/:id/removed/count', getUserRemovedViolationsCount)


export default router