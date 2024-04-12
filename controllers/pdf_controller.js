import asyncWrapper from "../middlewares/async_wrapper.js";
import PdfRepository from "../repositories/Pdf.js";
import { OK } from "../constants/status_codes.js";

export const deletePdf = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await PdfRepository.deletePdf(id)
        return res.status(OK).json(result);
    }
)

export const deleteAllPdfs = asyncWrapper(
    async (req, res) => {
        const result = await PdfRepository.deleteAllPdfs()
        return res.status(OK).json(result);
    }
)

export const archieveAllPdfs = asyncWrapper(
    async (req, res) => {
        const result = await PdfRepository.archieveAllPdfs()
        return res.status(OK).json(result);
    }
)