import { Schema, model } from 'mongoose'

const PDFArchieveSchema = new Schema({
  username: {
    type: String,
    required: true
  },

  pnid: {
    type: String,
    required: true,
  },

  name:{
      type: String,
      required: true
  },
  
  link:{
      type: String,
      required: true
  },
  created_at: {
      type: String,
      required: true
  },
})

const PDFArchieveModel = model('PDFArchieve', PDFArchieveSchema)

export default PDFArchieveModel