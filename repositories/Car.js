import moment from "moment";
import { ALREADY_EXISTS } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Car from "../models/Car.js";
import QrcodeRepository from "./Qrcode.js";

class CarRepository{

    static async getAllCars(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const cars = await Car.find({});
                return resolve(cars)
            })
        )
    }

    static async createCar({ boardNumber, privateNumber, kilometers }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let existingCar = await Car.findOne({ 
                    $or: [
                        { boardNumber },
                        { privateNumber }
                    ]
                })
        
                if(existingCar){
                    let car_already_exists_error = new CustomError(`Car with board number '${boardNumber}' or private number '${privateNumber}' already exists`, ALREADY_EXISTS)
                    return reject(car_already_exists_error)
                }

                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')

                const car = new Car({
                    boardNumber, privateNumber, kilometers, created_at
                })
        
                const qrcode_link = await QrcodeRepository.generateCarQrcode({
                    boardNumber,
                    privateNumber,
                    _id: car._id
                })
        
                car.qrcode = qrcode_link
                await car.save()

                return resolve(car)
            })
        )
    }

    static async deleteAllCars(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const cars = await Car.deleteMany({});
                return resolve(cars)
            })
        )
    }

    static async getCarById(car_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const car = await Car.findById(car_id);
                return resolve(car)
            })
        )
    }

    static async updateCar({ car_id, boardNumber, privateNumber,kilometers, currentKilometers  }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const new_car_qrcode = await QrcodeRepository.generateCarQrcode({
                    boardNumber,
                    privateNumber,
                    _id: car_id
                })
                
                const car = await Car.updateOne({ _id: car_id }, {
                    boardNumber, privateNumber,kilometers, currentKilometers,
                    qrcode: new_car_qrcode
                });

                return resolve(car)
            })
        )
    }

    static async deleteCar(car_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const car = await Car.deleteOne({
                    _id: car_id
                });
                return resolve(car)
            })
        )
    }

    static async resetCarKilometers(car_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const car = await Car.updateOne({ _id: car_id }, {
                    currentKilometers:0,
                });
                return resolve(car)
            })
        )
    }
}

export default CarRepository