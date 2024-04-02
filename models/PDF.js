import { Schema, model } from 'mongoose'

const PDFSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
    time:{
        type: String,
        default: new Date().toISOString().split('T')[1]
    }
})

const PDFModel = model('PDF', PDFSchema)

export default PDFModel