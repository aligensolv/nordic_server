import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ComplaintCategoryRepository from "../repositories/ComplaintCategory.js";

export const getAllComplaintCategories = asyncWrapper(
    async (req, res) => {
        const complaint_categories = await ComplaintCategoryRepository.getAllComplaintCategories()
        return res.status(OK).json(complaint_categories)
    }
)

export const createComplaintCategory = asyncWrapper(
    async (req, res) => {
        const { name } = req.body
        const createdComplaintCategory = await ComplaintCategoryRepository.createComplaintCategory(name)
        return res.status(OK).json(createdComplaintCategory)
    }
)

export const deleteAllComplaintCategories = asyncWrapper(
    async (req, res) => {
        const deletedComplaints = await ComplaintCategoryRepository.deleteAllComplaintCategories()
        return res.status(OK).json(deletedComplaints)
    }
)

export const deleteComplaintCategoryById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const deletedComplaint = await ComplaintCategoryRepository.deleteComplaintCategoryById(id)
        return res.status(OK).json(deletedComplaint)
    }
)