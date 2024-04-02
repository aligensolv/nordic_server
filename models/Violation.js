import { Schema, model } from 'mongoose';

// Define the User schema
const violationSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  accountId: {
    type: String,
    required: true,
  },
  violations:{
    type: Number,
    required: true
  },
  removed:{
    type: Number,
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
});

// Define the User model
const Violation = model('Violation', violationSchema);

export default Violation;
