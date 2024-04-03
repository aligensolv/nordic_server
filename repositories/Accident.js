import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Accident from "../models/Accident.js";

class AccidentRepository{
    static async getAllAccidents(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const accidents = await Accident.find({});
                return resolve(accidents)
            })
        )
    }

    static async createAccident({ content, pnid, username, private_number, board_number }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')
                const creation_time = moment().format('HH:mm:ss')
                
                const result = await Accident.create({
                    content,
                    pnid,
                    username,
                    privateNumber: private_number,
                    boardNumber: board_number,
                    createdAt: created_at,
                    time: creation_time
                });
                return resolve(result)
            })
        )
    }

    static async deleteAllAccidents(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Accident.deleteMany({});
                return resolve(result)
            })
        )
    }

    static async deleteAccidentById(accident_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Accident.deleteOne({
                    _id: accident_id
                });
                return resolve(result)
            })
        )
    }
}

export default AccidentRepository