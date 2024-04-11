import { Schema, model } from 'mongoose';

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pnid: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

const User = model('User', UserSchema);

export default User;
