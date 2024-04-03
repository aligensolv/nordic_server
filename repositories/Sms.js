import moment from "moment"
import SMS from "../models/SMS.js"
import { stringify } from 'querystring';
import { nexmo_api_key, nexmo_api_secret, nexmo_api_url, nexmo_from_name } from "../config.js";
import axios from "axios";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";

class SmsRepository{
    static async getAllSms(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const smss = await SMS.find({})
                return resolve(smss)
            })
        )
    }

    static async getTotalSmsCount(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const total = await SMS.countDocuments({})
                return resolve(total)
            })
        )
    }

    static async storeSms({ delivered_to, total_received, content, about, sender }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let delivery_date = moment().format('DD.MM.YYYY HH:mm:ss')

                const sms = await SMS.create({ delivery_date, delivered_to, total_received, content, about, sender })
                return resolve(sms)
            })
        )
    }

    static async sendMessage({ to, message }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const nexmo_data = stringify({
                    api_key: nexmo_api_key,
                    api_secret: nexmo_api_secret,
                    type: 'text',
                    from: nexmo_from_name,
                    to: to,
                    text: message
                });

                await axios.post(nexmo_api_url, nexmo_data,{
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded;'
                    }
                })

                return resolve(true)
            })
        )
    }

    static async getTotalSmsCount(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const count = await SMS.countDocuments({})
                return resolve(count)
            })
        )
    }
}

export default SmsRepository