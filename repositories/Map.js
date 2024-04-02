import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Map from "../models/Map.js";

class MapRepository{
    static async getAllMaps(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const maps = await Map.find({})
                return resolve(maps)
            })
        )
    }


    static async getMapById(map_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const map = await Map.findOne({
                    _id: map_id
                });
                return resolve(map)
            })
        )
    }


    static async deleteAllMaps(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const maps = await Map.deleteMany({});
                return resolve(maps)
            })
        )
    }


    static async deleteMapById(map_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const map = await Map.deleteOne({
                    _id: map_id
                });
                return resolve(map)
            })
        )
    }


    static async updateMap({ data, zone, longitude, latitude, map_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Map.updateOne({
                    _id: map_id
                }, { data, zone, longitude, latitude });
                return resolve(result)
            })
        )
    }


    static async getMapByZone(zone){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                console.log(zone);
                const map = await Map.findOne({
                    zone
                });
                console.log(map);
                return resolve(map)
            })
        )
    }


    static async createMap({ data, zone, longitude, latitude }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {

                const map = await Map.create({ data, zone, longitude, latitude })

                return resolve(map)
            })
        )
    }
}

export default MapRepository