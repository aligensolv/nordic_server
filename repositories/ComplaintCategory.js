import moment from "moment"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import ComplaintCategory from "../models/ComplaintCategory.js"

class ComplaintCategoryRepository{

    static async getAllComplaintCategories(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const complaint_categories = await ComplaintCategory.find({}, {__v: 0})
                return resolve(complaint_categories)
            })
        )
    }

    static async deleteAllComplaintCategories(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const deletedComplaints = await ComplaintCategory.deleteMany()
                return resolve(deletedComplaints)
            })
        )
    }

    static async deleteComplaintCategoryById(complaint_category_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const deletedComplaint = await ComplaintCategory.deleteOne({
                    _id: complaint_category_id
                })
                return resolve(deletedComplaint)
            })
        )
    }

    static async createComplaintCategory(name){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')
                const createdComplaintCategory = await ComplaintCategory.create({ name, created_at })
                return resolve(createdComplaintCategory)
            })
        )
    }
}

export default ComplaintCategoryRepository