import { Router } from 'express'
const router = Router()


import { 
  getAllUsers, 
  getUserById, 
  getUserByAccounId,
  register, 
  updateUser, 
  deleteUser, 
  deleteAllUsers, 
  login, 
  validateToken 
} from '../../controllers/users_controller.js'

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.get('/users/pnid/:id', getUserByAccounId);

router.post('/users', register);

router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.delete('/users', deleteAllUsers);

router.post('/users/login', login);


router.get('/users/token/validate', validateToken)


export default router
