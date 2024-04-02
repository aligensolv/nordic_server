import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import IssueCategory from "../models/IssueCategory.js";

class IssusCategoryRepository{
    static async getAllCategories(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const categories = await IssueCategory.find({});
                return resolve(categories)
            })
        )
    }

    static async getCategoryById(category_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const category = await IssueCategory.findOne({
                    _id: category_id
                });
                return resolve(category)
            })
        )
    }


    static async deleteAllCategories(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const categories = await IssueCategory.deleteMany({});
                return resolve(categories)
            })
        )
    }


    static async deleteCategoryById(category_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const category = await IssueCategory.deleteOne({
                    _id: category_id
                });
                return resolve(category)
            })
        )
    }


    static async updateCategory({ name, importanceLevel, category_id, problems }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await IssueCategory.updateOne({
                    _id: category_id
                }, { name, importanceLevel, problems });
                return resolve(result)
            })
        )
    }


    static async createCategory({ name, importanceLevel, problems }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await IssueCategory.create({ name, importanceLevel, problems });
                return resolve(result)
            })
        )
    }
}

export default IssusCategoryRepository