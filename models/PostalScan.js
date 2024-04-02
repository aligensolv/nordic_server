import { Schema, model } from 'mongoose';

const postalScanSchema = new Schema({
  violationNumber:{
    type: String,
    required: true
  },
  pnid:{
    type: String,
    required: true
  },
  reason:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  link:{
    type: String,
    required: true
  },
  date:{
    type: String,
    default: new Date().toISOString().split('T')[0]
  },
  fullDate:{
    type: String,
    default: Date.now().toString()
  }
});

const PostalScan = model('PostalScan', postalScanSchema);

export default PostalScan;
