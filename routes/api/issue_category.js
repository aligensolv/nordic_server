import { createIssueCategory, deleteAllIssueCategories, deleteIssueCategory, getAllIssueCategories, getIssueCategoryById, updateIssueCategory } from "../../controllers/issue_categories_controller.js"

import { Router } from 'express'

const router = Router()

router.get('/issues/categories', getAllIssueCategories)

router.get('/issues/categories/:id', getIssueCategoryById)

router.post('/issues/categories', createIssueCategory)

router.delete('/issues/categories/:id', deleteIssueCategory)

router.delete('/issues/categories', deleteAllIssueCategories)

router.put('/issues/categories/:id', updateIssueCategory)


export default router