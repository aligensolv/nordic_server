import mongoose from "mongoose";

const ComplaintQrcodeSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },

    qrcode_image: {
        type: String,
        required: true
    },

    location_owner_name: {
        type: String,
        required: true
    },

    phone_number: {
        type: String,
        required: true
    },

    created_at: {
        type: String,
        required: true
    }
})

const ComplaintQrcodeModel = mongoose.model('ComplaintQrcode', ComplaintQrcodeSchema)

export default ComplaintQrcodeModel