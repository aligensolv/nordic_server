import { Router } from 'express'
import IssusCategoryRepository from '../../repositories/IssueCategory.js'
import { OK } from '../../constants/status_codes.js'
import IssueModel from '../../models/Issue.js'
const router = Router()


router.get('/issues/categories', async (req, res) => {
    try{
        const categories = await IssusCategoryRepository.getAllCategories()

        return res.status(OK).render('issues/categories',{ categories })
    }catch(err){
        return res.status(500).render('errors/internal')
    }
})

router.get('/issues/categories/create', async (req, res) => {
    try{
    
        return res.render('issues/categories_create')
    }catch(err){
        return res.status(500).render('errors/internal',{
            error: err.message
        })
    }
})

router.get('/issues/categories/:id/update', async (req, res) => {

    const { id } = req.params
    let category = await IssusCategoryRepository.getCategoryById(id)

    return res.render('issues/categories_update',{
        category: category,
        problems: JSON.stringify(category.problems)
    })
})

router.get('/issues', async (req, res) => {

    let issues = await IssueModel.find({})

    return res.render('issues/index',{
        issues
    })
})


export default router