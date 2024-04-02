import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import MachineRepository from "../repositories/Machine.js";

export const createMachine = asyncWrapper(
    async (req, res) => {
        const { serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude } = req.body
        const result = await MachineRepository.createMachine({
            serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude
        })
        return res.status(OK).json(result);
    }
)


export const getAllMachines = asyncWrapper(
    async (req, res) => {
        const machines = await MachineRepository.getAllMachines()
        return res.status(OK).json(machines);
    }
)


export const getMachineById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const machine = await MachineRepository.getMachineById(id)
        return res.status(OK).json(machine);
    }
)


export const updateMachine = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude } = req.body
        const result = await MachineRepository.updateMachine({ 
            serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude, machine_id: id
         })
        return res.status(OK).json(result);
    }
)


export const deleteMachine = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await MachineRepository.deleteMachineById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllMachines = asyncWrapper(
    async (req, res) => {
        const result = await MachineRepository.deleteAllMachines()
        return res.status(OK).json(result);
    }
)


export const activateMachine = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await MachineRepository.activateMachine({ machine_id: id })
        return res.status(OK).json(result);
    }
)

