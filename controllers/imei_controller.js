import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ImeiRepository from "../repositories/Imei.js";

export const getAllImeis = asyncWrapper(
    async (req, res) => {
        const imeis = await ImeiRepository.getAllImeis()
        return res.status(OK).json(imeis);
    }
)


export const getImeiById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const imei = await ImeiRepository.getImeiById(id)
        return res.status(OK).json(imei);
    }
)


export const updateImei = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name, serial, zone } = req.body
        const result = await ImeiRepository.updateImei({ 
            name, serial, zone, imei_id: id
         })
        return res.status(OK).json(result);
    }
)


export const deleteAllImeis = asyncWrapper(
    async (req, res) => {
        const result = await ImeiRepository.deleteAllImeis()
        return res.status(OK).json(result);
    }
)


export const deleteImei = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await ImeiRepository.deleteImeiById(id)
        return res.status(OK).json(result);
    }
)


export const createImei = asyncWrapper(
    async (req, res) => {
        const { name, serial, zone } = req.body
        const result = await ImeiRepository.createImei({ name, serial, zone })
        return res.status(OK).json(result);
    }
)

