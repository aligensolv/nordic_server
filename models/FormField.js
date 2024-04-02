import { Schema, model } from 'mongoose'

const FormFieldSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    group:{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    form:{
        type:String,
        required: true
    },
    answerDataType:{
        type:String,
        default : "text" // Yes-No, Files, Text,
    },
    hasRequiredDescription:{
        type: Boolean,
        required: true
    },
    requiredDescription:{
        type:String,
        required:true
    },
    whenToGetDescription:{
        type: Boolean,
        default: true
    }
})

const FormFieldModel = model('FormField', FormFieldSchema)

export default FormFieldModel
