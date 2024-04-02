import { Schema, model } from 'mongoose';

const IMEISchema = new Schema({
  serial: {
    type: String,
    required: true,
    unique:true
  },
  name:{
    type: String,
    default: null
  },
  created_at: {
    type: String,
    required: true
  },
  zone:{
    type: Schema.Types.ObjectId,
    ref: 'Zone',
  }
});

const IMEI = model('IMEI', IMEISchema);

export default IMEI;
