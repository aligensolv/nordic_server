import moment from "moment"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import QrcodeRepository from "./Qrcode.js"
import ComplaintQrcode from "../models/ComplaintQrcode.js"
import ValidatorRepository from "./Validator.js"

class ComplaintQrcodeRepository{
    static async createComplaintQrcode({ location, location_owner_name, phone_number, categories }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')

                const complaint_qrcode = new ComplaintQrcode({
                    location, location_owner_name, phone_number, created_at, qrcode_image, categories
                })

                const qrcode_image = await QrcodeRepository.generateComplaintQrcode({ location_id: complaint_qrcode._id })

                await complaint_qrcode.save()

                return resolve(complaint_qrcode)
            })
        )
    }

    static async getAllComplaintQrcodes(limit){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                if(limit && await ValidatorRepository.isNumber(limit)){
                    const qrcodes = await ComplaintQrcode.find({}).limit(limit)
                    return resolve(qrcodes)
                }

                const qrcodes = await ComplaintQrcode.find({})
                return resolve(qrcodes)
            })
        )
    }

    static async getComplaintQrcodeById(id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const qrcode = await ComplaintQrcode.findById(id)
                return resolve(qrcode)
            })
        )
    }

    static async deleteComplaintQrcodeById(id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const deletedComplaintQrcode = await ComplaintQrcode.deleteOne({
                    _id: id
                })
                return resolve(deletedComplaintQrcode)
            })
        )
    }

    static async deleteAllComplaintQrcodes(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const deletedComplaintQrcodes = await ComplaintQrcode.deleteMany({})
                return resolve(deletedComplaintQrcodes)
            })
        )
    }

    static async updateComplaintQrcodeById({ id, location, location_owner_name, phone_number }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await ComplaintQrcode.updateOne({
                    _id: id
                }, { location, location_owner_name, phone_number })
                return resolve(result)
            })
        )
    }    
}

export default ComplaintQrcodeRepository