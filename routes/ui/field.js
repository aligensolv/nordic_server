import { Router } from 'express'
const router = Router()
import FormFieldRepository from '../../repositories/FormField.js';
import { OK } from '../../constants/status_codes.js';
import GroupRepository from '../../repositories/Group.js';
import uiAsyncWrapper from '../../middlewares/front_async_wrapper.js';


router.get('/fields', uiAsyncWrapper(
    async (req,res) =>{
        const fields = await FormFieldRepository.getAllFormFields()
        return res.status(OK).render('fields/index',{
            formFields: fields
        })
    }
))

router.get('/fields/create', uiAsyncWrapper(
    async (req,res) =>{
        const groups = await GroupRepository.getAllGroups()
        return res.status(OK).render('fields/create',{
            groups
        })
    }
))

router.get('/fields/:id/update', uiAsyncWrapper(
    async (req,res) =>{
        const field = await FormFieldRepository.getFormFieldById(req.params.id)
        const groups = await GroupRepository.getAllGroups()
        return res.status(OK).render('fields/edit',{
            field,
            groups
        })
    }
))

export default router