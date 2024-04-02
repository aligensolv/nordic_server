import moment from "moment"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import Location from "../models/Location.js"

class LocationRepository{
    static async getAllLocations(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const locations = await Location.find({})
                return resolve(locations)
            })
        )
    }


    static async getLocationsByZone(zone){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const locations = await Location.find({ zone })
                return resolve(locations)
            })
        )
    }


    static async deleteAllLocations(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const locations = await Location.deleteMany({});
                return resolve(locations)
            })
        )
    }


    static async deleteLocationById(location_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const location = await Location.deleteOne({
                    _id: location_id
                });
                return resolve(location)
            })
        )
    }


    static async updateLocation({ location, days, shifts, location_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Location.updateOne({
                    _id: location_id
                }, { location, days, shifts });
                return resolve(result)
            })
        )
    }


    static async createLocation({ location, days, shifts }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('YYYY-MM-DD HH:mm:ss')
                const result = await Location.create({ location, days, shifts, created_at });
                return resolve(result)
            })
        )
    }


    static async getLocationById(location_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const location = await Location.findById(location_id);
                return resolve(location)
            })
        )
    }
}


export default LocationRepository