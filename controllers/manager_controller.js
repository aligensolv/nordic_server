import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ManagerRepository from "../repositories/Manager.js";

export const getAllManagers = asyncWrapper(
    async (req, res) => {
        const managers = await ManagerRepository.getAllManagers()
        return res.status(OK).json(managers);
    }
)


export const getManagerById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const manager = await ManagerRepository.getManagerById(id)
        return res.status(OK).json(manager);
    }
)


export const updateManager = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { permissions, name, username, password, role } = req.body
        const token = req.cookies.jwt_token

        const result = await ManagerRepository.updateManager({ 
            name, username, password, role, permissions, manager_id: id, token
        })
        return res.status(OK).json(result);
    }
)


export const deleteManagerById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await ManagerRepository.deleteManagerById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllManagers = asyncWrapper(
    async (req, res) => {
        const result = await ManagerRepository.deleteAllManagers()
        return res.status(OK).json(result);
    }
)

export const createManager = asyncWrapper(
    async (req, res) => {
        const { name, username, password, role, permissions } = req.body
        const result = await ManagerRepository.createManager({ name, username, password, role, permissions })
        return res.status(OK).json(result);
    }
)

export const loginTechnician = asyncWrapper(
    async (req, res) => {
        const { username, password } = req.body
        const result = await ManagerRepository.loginTechnician({ username, password })
        return res.status(OK).json(result);
    }
)