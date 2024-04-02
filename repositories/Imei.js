import moment from "moment";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import IMEI from "../models/IMEI.js";
import CustomError from "../interfaces/custom_error_class.js";
import { NOT_FOUND } from "../constants/status_codes.js";

class ImeiRepository{
    static async getAllImeis(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const imeis = await IMEI
                .find({})
                .populate({
                    path: 'zone',
                    ref: 'Zone'
                })

                return resolve(imeis)
            })
        )
    }

    static async getImeisSerialsByZones(zones){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const matched_imeis = await IMEI.find({ 
                    zone: { $in: zones } 
                })

                const imeis_list = matched_imeis.map(e =>{
                    return e.serial
                })

                return resolve(imeis_list)

            })
        )
    }


    static async createImei({ name, serial, zone }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await IMEI.create({ 
                    name, serial, zone,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss")
                });
                return resolve(result)
            })
        )
    }

    static async updateImei({ name, serial, zone, imei_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await IMEI.updateOne({
                    _id: imei_id
                }, { name, serial, zone });
                return resolve(result)
            })
        )
    }


    static async getImeiById(imei_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const imei = await IMEI.findById(imei_id)

                if(!imei){
                    let imei_not_found_error = new CustomError(`Imei '${imei_id}' does not exist`, NOT_FOUND)
                    return reject(imei_not_found_error)
                }

                return resolve(imei)
            })
        )
    }


    static async deleteAllImeis(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const imeis = await IMEI.deleteMany({});
                return resolve(imeis)
            })
        )
    }


    static async deleteImeiById(imei_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const imei = await IMEI.deleteOne({
                    _id: imei_id
                });

                if(imei.deletedCount === 0){
                    let imei_not_found_error = new CustomError(`Imei '${imei_id}' was not deleted`, NOT_FOUND)
                    return reject(imei_not_found_error)
                }
                return resolve(imei)

            })
        )
    }
}


export default ImeiRepository