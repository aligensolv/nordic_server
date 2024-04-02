import { Schema, model } from 'mongoose';
import { schedule } from 'node-cron';
import Admin from '../utils/firebase.js';


const machineSchema = Schema({
    serial:{
        type: Number,
        required: true
    },
    totalWorkingTime:{
      type: Number,
      default: 0
    },

    totalOfflineTime:{
      type: Number,
      default: 0
    },

    lastActiveTime:{
      type: String,
      default: null
    },
    
    status:{
      type: String,
      enum: ['active','waiting','inactive'],
      default: 'active'
    },
    qrcode:{
      type: String,
      default: null
    },
    zone:{
      type: Schema.Types.ObjectId,
      ref: 'Zone',
      required: true
    },
    zoneLocation:{
      type: String,
      required: true
    },

    longitude:{
      type: Number,
      required: true
    },

    latitude:{
      type: Number,
      required: true
    },

    categories:{
      type: [Schema.Types.ObjectId],
      ref: 'IssueCategory',
      required: true
    }
  }
);

const MachineModel = model('machine', machineSchema)

// Define a function to send notifications
async function sendNotifications() {
  try {
    let mahcinesWithIssues = await MachineModel.find({
      status: 'inactive'
    })

    if(mahcinesWithIssues.length > 0){
      const message = {
        data: {
            title: 'non-fixed machines',
            body: 'There are some non-fixed machines available',
            type: 'issue_not_closed_notify',
        },
        topic: 'dev', // Replace with the topic you want to use
      };
      
      let response = await Admin.messaging()
        .send(message)
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}

// Schedule the task to run every hour
schedule('0 */10 * * * *', () => {
  console.log(new Date());
  sendNotifications();
});

export default MachineModel;