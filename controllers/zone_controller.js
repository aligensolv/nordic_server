import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ZoneRepository from "../repositories/Zone.js";

export const getAllZones = asyncWrapper(
    async (req, res) => {
        const zones = await ZoneRepository.getAllZones()
        return res.status(OK).json(zones);
    }
)


export const getZoneById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const zone = await ZoneRepository.getZoneById(id)
        return res.status(OK).json(zone);
    }
)


export const updateZone = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        const result = await ZoneRepository.updateZone({ 
            name, zone_id: id
         })
        return res.status(OK).json(result);
    }
)


export const deleteZone = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await ZoneRepository.deleteZoneById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllZones = asyncWrapper(
    async (req, res) => {
        const result = await ZoneRepository.deleteAllZones()
        return res.status(OK).json(result);
    }
)


export const createZone = asyncWrapper(
    async (req, res) => {
        const { name } = req.body
        const result = await ZoneRepository.createZone({
            name
        })
        return res.status(OK).json(result);
    }
)

