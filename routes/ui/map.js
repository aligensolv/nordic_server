import { Router } from 'express';
const router = Router();
import Map from '../../models/Map.js';
import jwt from 'jsonwebtoken';
import Manager from '../../models/Manager.js';
import { jwt_secret_key } from '../../config.js';
import MapRepository from '../../repositories/Map.js';

// Render the list of maps
router.get('/maps', async (req, res) => {
    try {
        const maps = await MapRepository.getAllMaps(); // If you have a reference to the Zone model
        res.render('maps/read', { 
            maps
        });
    } catch (err) {
        console.error('Error fetching maps:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the edit form for a map
router.get('/maps/:id/edit', async (req, res) => {
    try {
        const map = await MapRepository.getMapById(req.params.id);
        res.render('maps/edit', {
            map
        });
    } catch (err) {
        console.error('Error fetching map:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the create form for a map
router.get('/maps/create',async (req, res) => {
    res.render('maps/create');
});


export default router;
