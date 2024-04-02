import { OK } from '../constants/status_codes.js'
import asyncWrapper from '../middlewares/async_wrapper.js'
import Location from '../models/Location.js'
import LocationRepository from '../repositories/Location.js'

export const createLocation = asyncWrapper(
    async (req, res) => {
        const { location, days, shifts } = req.body
        console.log({ location, days, shifts })
        await LocationRepository.createLocation({ location, days, shifts })

        return res.status(OK).send("Location Was Created")
    }
)

export const updateLocation = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { location, days, shifts } = req.body
        await LocationRepository.updateLocation({ location, days, shifts, location_id: id })

        return res.status(OK).send("Location Was Updated")
    }
)

export const deleteLocation = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await LocationRepository.deleteLocationById(id)

        return res.status(OK).send("Location Was Deleted")
    }
)


export const deleteAllLocations = asyncWrapper(
    async (req, res) => {
        await LocationRepository.deleteAllLocations()
        return res.status(OK).send("All Locations Was Deleted")
    }
)

export const getAllLocations = asyncWrapper(
    async (req, res) => {
        const locations = await LocationRepository.getAllLocations()
        return res.status(OK).json(locations)
    }
)