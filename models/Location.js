import { Schema, model } from 'mongoose'

const LocationSchema = new Schema({
    location: {
        type: String,
        required: true,
        unique: true
    },

    days:{
        type:[String],
        required: true
    },
    shifts:{
        type:[String],
        required:true
    },

    created_at: {
        type: String,
        required: true
    }
})

const LocationModel = model('Location', LocationSchema)

export default LocationModel