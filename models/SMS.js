import { Schema, model } from 'mongoose'

const SMSSchema = new Schema({
    delivery_date:{
        type: String,
        required: true,
    },

    delivered_to:{
        type: [String],
        required: true,
    },

    total_received:{
        type: Number,
        required: true,
    },

    content:{
        type: String,
        required: true,
    },


    about:{
        type: String,
        required: true,
    },

    sender:{
        type: String,
        default: '4740088605'
    }
})

const SMSModel = model('Sms', SMSSchema)
export default SMSModel