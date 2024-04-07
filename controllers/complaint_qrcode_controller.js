import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ComplaintQrcodeRepository from "../repositories/ComplaintQrcode.js";

export const createComplaintQrcode = asyncWrapper(
    async (req, res) => {
        const { location, location_owner_name, phone_number, categories } = req.body
        const result = await ComplaintQrcodeRepository.createComplaintQrcode({ location, location_owner_name, phone_number, categories })
        return res.status(OK).json(result)
    }
)


export const getAllComplaintQrcodes = asyncWrapper(
    async (req, res) => {
        const qrcodes = await ComplaintQrcodeRepository.getAllComplaintQrcodes()
        return res.status(OK).json(qrcodes);
    }
)

export const getComplaintQrcodeById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const qrcode = await ComplaintQrcodeRepository.getComplaintQrcodeById(id)
        return res.status(OK).json(qrcode);
    }
)


export const deleteComplaintQrcodeById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await ComplaintQrcodeRepository.deleteComplaintQrcodeById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllComplaintQrcodes = asyncWrapper(
    async (req, res) => {
        const result = await ComplaintQrcodeRepository.deleteAllComplaintQrcodes()
        return res.status(OK).json(result);
    }
)


export const updateComplaintQrcodeById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { location, location_owner_name, phone_number } = req.body
        const result = await ComplaintQrcodeRepository.updateComplaintQrcodeById({ id, location, location_owner_name, phone_number })
        return res.status(OK).json(result)
    }
)