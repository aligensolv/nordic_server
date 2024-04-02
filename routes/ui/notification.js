import { Router } from 'express'
const router = Router()
import Notification from '../../models/NotificationModel.js'
import jwt from 'jsonwebtoken'
import Manager from '../../models/Manager.js'
import { jwt_secret_key } from '../../config.js'

router.get('/notifications',async (req,res) =>{
  try{

    let notifications = await find()
    notifications = notifications.reverse()
    return res.status(200).render('notifications/read',{
      notifications,
    })
  }catch(error){

  }
})


export default router