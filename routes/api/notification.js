import { Router } from 'express';
const router = Router()

import { 
  getAllNotifications,
  getIssueNotifications,
  getNotificationsByImeis,
  getNotificationsByZone,
  sendNotificaitonToAllUsers, 
  sendNotificationToCertainDevices, 
  sendNotificationToZones 
} from '../../controllers/notification_controller.js';



router.post('/notifications/users', sendNotificaitonToAllUsers)


router.post('/notifications/zones', sendNotificationToZones)

router.post('/notifications/devices', sendNotificationToCertainDevices)

router.get('/notifications', getAllNotifications )

router.get('/notifications/imei/:id', getNotificationsByImeis)

router.get('/notifications/zones/:id', getNotificationsByZone)

router.get('/notifications/issues', getIssueNotifications)



export default router