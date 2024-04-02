import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import MapRepository from "../repositories/Map.js";

export const createMap = asyncWrapper(
    async (req, res) => {
        const { data, zone, longitude, latitude } = req.body
        const result = await MapRepository.createMap({ data, zone, longitude, latitude })
        return res.status(OK).json(result);
    }
)


export const getMapByZone = asyncWrapper(
    async (req, res) => {
        const zone = req.params.id
        const map = await MapRepository.getMapByZone(zone)
        return res.status(OK).json(map);
    }
)


export const getAllMaps = asyncWrapper(
    async (req, res) => {
        const maps = await MapRepository.getAllMaps()
        return res.status(OK).json(maps);
    }
)


export const updateMap = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { data, zone, longitude, latitude } = req.body
        const result = await MapRepository.updateMap({ 
            data, zone, longitude, latitude, map_id: id
         })
        return res.status(OK).json(result);
    }
)


export const deleteMap = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await MapRepository.deleteMapById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllMaps = asyncWrapper(
    async (req, res) => {
        const result = await MapRepository.deleteAllMaps()
        return res.status(OK).json(result);
    }
)

