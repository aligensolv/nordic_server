import { Schema, model } from 'mongoose'

const AccidentSchema = new Schema({
    boardNumber:{
        type: String,
        required: true
    },
    privateNumber:{
        type:String,
        required: true
    },
    createdAt:{
      type:String,
      default: new Date().toISOString().split('T')[0]
    },
    username:{
      type:String,
      required:true
    },
    pnid:{
      type:String,
      required: true
    },
    content:{
      type: String,
      required: true
    },
    time:{
      type: String,
      default: new Date().toISOString().split('T')[1]
    }
})

const AccidentModel = model('Accident', AccidentSchema)

export default AccidentModel