import { Router } from 'express';
const router = Router();
import PDF from '../../models/PDF.js';
import jwt from 'jsonwebtoken';
import Manager from '../../models/Manager.js';
import PdfRepository from '../../repositories/Pdf.js';
import asyncWrapper from '../../middlewares/async_wrapper.js';


// CREATE - Create a new PDF
router.post('/pdfs', async (req, res) => {
    try {
        const { name, link } = req.body;
        const newPDF = new PDF({ name, link });
        await newPDF.save();
        return res.status(201).json(newPDF);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ - Get all PDFs
router.get('/pdfs', async (req, res) => {
    try {

        const pdfs = await PdfRepository.getAllPdfs()
        return res.status(200).render('pdf/pdf_list', { 
            pdfs
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// READ - Get a specific PDF by ID
router.get('/pdfs/:id', asyncWrapper(
    async (req, res) => {
        const pdf = await PdfRepository.getPdfById(req.params.id);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        let link = pdf.link.split('.in')[1]
        return res.status(200).render('pdf/pdf_show.ejs', { 
            link
         });
    }
));

// READ - Get a specific PDF by ID
router.get('/pdfs/:id/edit', async (req, res) => {
    try {
        let jwt_access_token = req.cookies.jwt_token
    let decoded = verify(jwt_access_token,process.env.JWT_SECRET_KEY)
    let manager = await findOne({ _id: decoded.id })

        const pdf = await findById(req.params.id);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        return res.status(200).render('pdf/pdf_edit', { 
            pdf,
            isAdmin: decoded.role === 'admin',
      permissions: manager.permissions
         });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// UPDATE - Update an existing PDF by ID
router.put('/pdf/:id', async (req, res) => {
    try {
        const { name, link } = req.body;
        const updatedPDF = await findByIdAndUpdate(
            req.params.id,
            { name, link },
            { new: true }
        );
        if (!updatedPDF) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        return res.status(200).json(updatedPDF);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE - Delete a PDF by ID
router.delete('/pdf/:id', async (req, res) => {
    try {
        const deletedPDF = await findByIdAndDelete(req.params.id);
        if (!deletedPDF) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        return res.status(200).json({ message: 'PDF deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
