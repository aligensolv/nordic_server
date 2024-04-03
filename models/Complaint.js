import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    plate_number: {
        type: String,
        default: null
    },

    phone_number: {
        type: String,
        default: null
    },

    is_following: {
        type: Boolean,
        default: false
    },

    created_at: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'completed']
    },

    image: {
        type: String,
        default: null
    },

    location: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        coords: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    },

    was_solved: {
        type: Boolean,
        default: false
    },

    was_violated: {
        type: Boolean,
        default: false
    },

    violation_image: {
        type: String,
        default: null
    },

    not_violated_reason:{
        type: String,
        default: null
    },

    accepted_at: {
        type: String,
        default: null
    },

    total_waiting_time: {
        type: Number,
        default: null
    },

    total_complete_time:{
        type: Number,
        default: null
    },

    accepted_by: {
        name: {
            type: String,
            default: null
        },
        pnid: {
            type: String,
            default: null
        },

        user_id: {
            type: String,
            default: null
        }
    },

    completed_at: {
        type: String,
        default: null
    },

    completed_by: {
        name: {
            type: String,
            default: null
        },
        pnid: {
            type: String,
            default: null
        },

        user_id: {
            type: String,
            default: null
        }
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema)

export default Complaint