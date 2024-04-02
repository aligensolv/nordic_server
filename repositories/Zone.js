import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Zone from "../models/Zone.js";

class ZoneRepository{

    static async getAllZones(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const zones = await Zone.find({})
                return resolve(zones)
            })
        )
    }


    static async getZoneById(zone_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const zone = await Zone.findOne({
                    _id: zone_id
                });
                return resolve(zone)
            })
        )
    }


    static async deleteAllZones(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const zones = await Zone.deleteMany({});
                return resolve(zones)
            })
        )
    }


    static async deleteZoneById(zone_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const zone = await Zone.deleteOne({
                    _id: zone_id
                });
                return resolve(zone)
            })
        )
    }


    static async updateZone({ name, zone_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Zone.updateOne({
                    _id: zone_id
                }, { name});
                return resolve(result)
            })
        )
    }


    static async createZone({ name, longitude, latitude }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Zone.create({ name, longitude, latitude });
                return resolve(result)
            })
        )
    }
}


export default ZoneRepository