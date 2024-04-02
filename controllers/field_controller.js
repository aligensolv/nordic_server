import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import FormFieldRepository from "../repositories/FormField.js";
import ValidatorRepository from "../repositories/Validator.js";

export const createFormField = asyncWrapper(
    async (req, res) => {
        const {title,answerDataType,group,form,hasRequiredDescription,requiredDescription} = req.body
        await ValidatorRepository.validateNotNull({
            title,answerDataType,group,form,requiredDescription
        })

        const field = await FormFieldRepository.createFormField({
            title,answerDataType,group,form,hasRequiredDescription,requiredDescription
        })
        return res.status(OK).json(field);
    }
)

export const getAllFormFields = asyncWrapper(
    async (req, res) => {
        const fields = await FormFieldRepository.getAllFormFields()
        return res.status(OK).json(fields);
    }
)

export const getFormFieldById = asyncWrapper(
    async (req, res) => {
        const field = await FormFieldRepository.getFormFieldById(req.params.id)
        return res.status(OK).json(field);
    }
)

export const deleteAllFormFields = asyncWrapper(
    async (req, res) => {
        const fields = await FormFieldRepository.deleteAllFormFields()
        return res.status(OK).json(fields);
    }
)

export const deleteFormFieldById = asyncWrapper(
    async (req, res) => {
        const field = await FormFieldRepository.deleteFormFieldById(req.params.id)
        return res.status(OK).json(field);
    }
)

export const getFormFieldByName = asyncWrapper(
    async (req, res) => {
        const field = await FormFieldRepository.getFormFieldByName(req.params.name)
        return res.status(OK).json(field);
    }
)

export const updateFormField = asyncWrapper(
    async (req, res) => {
        const {title,answerDataType,group,form,hasRequiredDescription,requiredDescription} = req.body
        const field = await FormFieldRepository.updateFormFieldById({
            title,answerDataType,group,form,hasRequiredDescription,requiredDescription,
            form_id: req.params.id,
        })
        return res.status(OK).json(field);
    }
)