import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import GroupRepository from "../repositories/Group.js";

export const createGroup = asyncWrapper(
    async (req, res) => {
        const { name } = req.body
        const result = await GroupRepository.createGroup({
            name
        })
        return res.status(OK).json(result);
    }
)


export const deleteGroup = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await GroupRepository.deleteGroup(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllGroups = asyncWrapper(
    async (req, res) => {
        const result = await GroupRepository.deleteAllGroups()
        return res.status(OK).json(result);
    }
)


export const getAllGroups = asyncWrapper(
    async (req, res) => {
        const groups = await GroupRepository.getAllGroups()
        return res.status(OK).json(groups);
    }
)


export const updateGroup = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        const result = await GroupRepository.updateGroup({
            group_id: id,
            name
        })
        return res.status(OK).json(result);
    }
)

