import { Schema, model } from 'mongoose';

const IssueCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    problems:{
        type: [String],
        default: []
    },

    importanceLevel:{
        type: Number,
        required: true
    }
})

const IssueCategoryModel = model('IssueCategory', IssueCategorySchema)

export default IssueCategoryModel