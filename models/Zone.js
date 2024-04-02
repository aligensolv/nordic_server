import { Schema, model } from 'mongoose';

const zoneSchema = new Schema({
  name:{
    type: String,
    required: true,
    unique: true
  },
});

const Zone = model('Zone', zoneSchema);

export default Zone;
