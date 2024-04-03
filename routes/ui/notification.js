import { Router } from 'express'
const router = Router()
import Notification from '../../models/NotificationModel.js'


router.get('/notifications',async (req,res) =>{
  try{

    let notifications = await Notification.find()
    notifications = notifications.reverse()
    return res.status(200).render('notifications/read',{
      notifications,
    })
  }catch(error){
    console.log(error.message)
    return res.status(500).send('Internal Server Error')
  }
})


export default router