import { Schema, model } from 'mongoose'

const notificationSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  
  body:{
    type: String,
    required: true
  },  

  imeis:{
    type: [String],
    default: ['*']
  },

  zones:{
    type: [String],
    default: ['*']
  },

  created_at: {
    type: String,
    required: true
  },
})

const NotificationModel = model('Notification',notificationSchema)
export default NotificationModel