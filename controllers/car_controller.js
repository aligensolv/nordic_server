import CarRepository from '../repositories/Car.js';
import { OK } from '../constants/status_codes.js';
import asyncWrapper from '../middlewares/async_wrapper.js';


export const createNewCar = asyncWrapper(
    async (req, res) => {
        const { boardNumber, privateNumber, kilometers } = req.body
        const result = await CarRepository.createCar({
            boardNumber,
            privateNumber,
            kilometers
        })

        return res.status(OK).send(result)
    }
)

export const getAllCars = asyncWrapper(
    async (req, res) => {
        const cars = await CarRepository.getAllCars()
        return res.status(OK).json(cars);
    }
)


export const updateCar = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { boardNumber, privateNumber,kilometers } = req.body
        const result = await CarRepository.updateCar({
            car_id: id,
            kilometers,
            boardNumber,
            privateNumber
        })

        return res.status(OK).json(result)
    }
)
export const deleteCar = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await CarRepository.deleteCar(id)
        return res.status(OK).json(result);
    }
)

export const deleteAllCars = asyncWrapper(
    async (req, res) => {
        const result = await CarRepository.deleteAllCars()
        return res.status(OK).json(result);
    }
)

export const resetCarKilometers = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await CarRepository.resetCarKilometers(id)
        return res.status(OK).json(result);
    }
)
