import { Schema, model } from 'mongoose';

const IssueReportSchema = new Schema({
    pdf:{
        type: String,
        required: true
    },

    notes:{
        type: String,
        default: ''
    },

    details:{
        type: String,
        default: ''
    },

    image:{
        type: String,
        required: true
    },

    created_at:{
        type: String,
        required: true
    },

    serial:{
        type: String,
        required: true
    },

    zone:{
        type: String,
        required: true
    },

    zoneLocation:{
        type: String,
        required: true
    }
})

export default model('IssueReport', IssueReportSchema);