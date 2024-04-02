import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import IssusCategoryRepository from "../repositories/IssueCategory.js";

export const createIssueCategory = asyncWrapper(
    async (req, res) => {
        const { name, importanceLevel, problems } = req.body
        console.log(name, importanceLevel, problems);
        const result = await IssusCategoryRepository.createCategory({ name, importanceLevel, problems })
        return res.status(OK).json(result);
    }
)


export const getAllIssueCategories = asyncWrapper(
    async (req, res) => {
        const categories = await IssusCategoryRepository.getAllCategories()
        return res.status(OK).json(categories);
    }
)


export const getIssueCategoryById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const category = await IssusCategoryRepository.getCategoryById(id)
        return res.status(OK).json(category);
    }
)


export const updateIssueCategory = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name, importanceLevel, problems } = req.body
        const result = await IssusCategoryRepository.updateCategory({ 
            name, importanceLevel, problems, category_id: id
         })
        return res.status(OK).json(result);
    }
)


export const deleteIssueCategory = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await IssusCategoryRepository.deleteCategoryById(id)
        return res.status(OK).json(result);
    }
)


export const deleteAllIssueCategories = asyncWrapper(
    async (req, res) => {
        const result = await IssusCategoryRepository.deleteAllCategories()
        return res.status(OK).json(result);
    }
)
