import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import FormField from "../models/FormField.js"

class FormFieldRepository{
    static async createFormField({ title,answerDataType,group,form,hasRequiredDescription,requiredDescription }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formField = await FormField.create({ title,answerDataType,group,form,hasRequiredDescription,requiredDescription })
                return resolve(formField)
            })
        )
    }

    static async getAllFormFields(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formFields = await FormField.find({})
                return resolve(formFields)
            })
        )
    }

    static async getFormFieldById(id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formField = await FormField.findById(id)
                return resolve(formField)
            })
        )
    }

    static async deleteAllFormFields(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formFields = await FormField.deleteMany({})
                return resolve(formFields)
            })
        )
    }

    static async deleteFormFieldById(id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formField = await FormField.findByIdAndDelete(id)
                return resolve(formField)
            })
        )
    }

    static async getFormFieldByName(name){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formField = await FormField.find({ form: name }).populate({
                    path:'group',
                    ref:'Group'
                })
                console.log(formField);
                return resolve(formField)
            })
        )
    }

    static async updateFormFieldById({ form_id, title,answerDataType,group,form,hasRequiredDescription,requiredDescription }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const formField = await FormField.updateOne({_id: form_id},{
                    title,answerDataType,group,form,hasRequiredDescription,requiredDescription
                })
                return resolve(formField)
            })
        )
    }
}

export default FormFieldRepository