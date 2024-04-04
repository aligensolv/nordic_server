import mongoose from "mongoose";

const ComplaintCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    created_at: {
        type: String,
        required: true
    }
})

const ComplaintCategory = mongoose.model('ComplaintCategory', ComplaintCategorySchema)

export default ComplaintCategory