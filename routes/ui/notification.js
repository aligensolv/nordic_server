import { Router } from 'express'
const router = Router()
import Notification from '../../models/NotificationModel.js'
import jwt from 'jsonwebtoken'
import Manager from '../../models/Manager.js'
import { jwt_secret_key } from '../../config.js'

router.get('/notifications',async (req,res) =>{
  try{
    let jwt_access_token = req.cookies.jwt_token
    let decoded = verify(jwt_access_token,jwt_secret_key)
    let manager = await findOne({ _id: decoded.id })

    let notifications = await find()
    notifications = notifications.reverse()
    return res.status(200).render('notifications/read',{
      notifications,
      isAdmin: decoded.role === 'admin',
      permissions: manager.permissions
    })
  }catch(error){

  }
})


export default router