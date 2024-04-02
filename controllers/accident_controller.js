import asyncWrapper from "../middlewares/async_wrapper.js"
import AccidentRepository from "../repositories/Accident.js"

export const getAllAccidents = asyncWrapper(
    async (req, res) => {
        const accidents = await AccidentRepository.getAllAccidents()
        return res.status(OK).json(accidents)
    }
)

export const createAccident = asyncWrapper(
    async (req, res) => {
        const { pnid, date, time } = req.body
        const result = await AccidentRepository.createAccident({})
        return res.status(OK).json(result);
    }
)


export const deleteAllAccidents = asyncWrapper(
    async (req, res) => {
        const result = await AccidentRepository.deleteAllAccidents()
        return res.status(OK).json(result);
    }
)


export const deleteAccidentById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await AccidentRepository.deleteAccidentById(id)
        return res.status(OK).json(result);
    }
)