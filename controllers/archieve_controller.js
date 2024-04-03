import { OK } from "../constants/status_codes.js"
import asyncWrapper from "../middlewares/async_wrapper.js"
import ArchieveRepository from "../repositories/Archieve.js"

export const getAllArchives = asyncWrapper(
    async (req, res) => {
        const archives = await ArchieveRepository.getAllArchives()
        return res.status(OK).json(archives)
    }
)

export const getArchiveById = asyncWrapper(
    async (req, res) => {
        const archive = await ArchieveRepository.getArchiveById(req.params.id)
        return res.status(OK).json(archive)
    }
)

export const storeArchieve = asyncWrapper(
    async (req, res) => {
        const { pdf, user } = req.body
        const result = await ArchieveRepository.storeArchieve({ pdf, user })
        return res.status(OK).json(result)
    }
)