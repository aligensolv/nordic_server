import { Schema, model } from 'mongoose';

// Define the User schema
const managerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: String,
    default: Date.now().toString()
  },
  password: {
    type: String,
    required: true
  },

  role:{
    type: String,
    default: 'manager'
  },

  permissions:[{
    route: String,
    method: String
  }]
});

// Define the User model
const Manager = model('Manager', managerSchema);

export default Manager;
