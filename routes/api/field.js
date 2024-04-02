import { Router } from 'express';
const router = Router();
import FormField from '../../models/FormField.js';
import { createFormField, deleteAllFormFields, deleteFormFieldById, getAllFormFields, getFormFieldById, getFormFieldByName, updateFormField } from '../../controllers/field_controller.js';

// Route: /api/formFields
router.get('/fields', getAllFormFields);

router.post('/fields/', createFormField);

router.get('/fields/:id', getFormFieldById);

router.put('/fields/:id', updateFormField);

router.delete('/fields/:id', deleteFormFieldById);

router.get('/fields/form/:name', getFormFieldByName)

router.delete('/fields', deleteAllFormFields);
export default router;
