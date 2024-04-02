import { Schema, model } from 'mongoose'

const GroupSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    notice:{
        type:String,
        default: null
    },
    text:{
        type:String,
        default: null
    }
})

const GroupModel = model('Group', GroupSchema)

export default GroupModel
