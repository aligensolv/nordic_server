import { Schema, model } from 'mongoose'

const issueNotificationSchema = new Schema({
  created_at:{
    type: String,
    required: true
  },

  title:{
    type: String,
    required: true
  },

  body:{
    type: String,
    required: true
  },

  notification_type:{
    type: String,
    enum: ['normal', 'issue', 'important', 'activation', 'maintenance'],
    required: true
  }
})

const IssueNotificationModel = model('IssueNotification',issueNotificationSchema)
export default IssueNotificationModel