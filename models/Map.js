import { Schema, model } from 'mongoose'

const mapSchema = new Schema({

  data:{
    type: String,
    required: true
  },

  zone:{
    type: Schema.Types.ObjectId,
    ref: 'Zone'
  },

  longitude:{
    type: Number,
    required: true
  },

  latitude:{
    type: Number,
    required: true
  }
})

const Map = model('Map', mapSchema)

export default Map