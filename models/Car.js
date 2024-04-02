import { Schema, model } from 'mongoose'

const CarSchema = new Schema({
    boardNumber:{
        type: String,
        required: true
    },
    privateNumber:{
        type:String,
        required: true
    },
    kilometers:{
        type:Number,
        required: true
    },
    currentKilometers:{
        type: Number,
        default:0
    },
    qrcode:{
        type:String,
        default:null
    },

    created_at: {
        type: String,
        required: true
    }
})

const CarModel = model('Car', CarSchema)

export default CarModel
