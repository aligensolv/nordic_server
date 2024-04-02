import { Schema, model } from 'mongoose';

const AppNotificationSchema = new Schema({
    delivery_date:{
        type: String,
        required: true,
    },

    content:{
        type: String,
        required: true,
    },


    title:{
        type: String,
        required: true,
    },
})

const AppNotificationModel = model('AppNotification', AppNotificationSchema)

export default AppNotificationModel