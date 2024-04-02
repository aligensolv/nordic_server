import moment from "moment"
import Email from "../models/Email.js"
import ValidatorRepository from "./Validator.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"

class EmailRepository{
    static async storeEmail({ to, subject, content, text, html }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await ValidatorRepository.isEmail(to)
                
                const created_at = moment().format('YYYY-MM-DD HH:mm:ss')
                const email = await Email.create({ to, subject, content, text, html, created_at })
                return resolve(email)
            })
        )
    }
} 

export default EmailRepository