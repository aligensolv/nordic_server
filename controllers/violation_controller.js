import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ViolationRepository from "../repositories/Violation.js";

export const getViolationById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const violation = await ViolationRepository.getViolationById(id)
        return res.status(OK).json(violation);
    }
)

export const getUserViolations = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const violations = await ViolationRepository.getUserViolations(id)
        return res.status(OK).json(violations);
    }
)

export const getUserRemovedViolationsCount = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        // const violations = await ViolationRepository.getTotalRemovedViolationsCount(id)
        return res.status(OK).json(true);
    }
)

export const getViolationCount = asyncWrapper(
    async (req, res) => {
        const count = await ViolationRepository.getTotalViolationsCount()
        return res.status(OK).json(count);
    }
)

export const getTotalRemovedViolationsCount = asyncWrapper(
    async (req, res) => {
        const count = await ViolationRepository.getTotalRemovedViolationsCount()
        return res.status(OK).json(count);
    }
)