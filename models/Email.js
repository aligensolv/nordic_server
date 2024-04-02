import mongoose from 'mongoose'

const EmailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    }
})

const Email = mongoose.model('Email', EmailSchema)

export default Email

