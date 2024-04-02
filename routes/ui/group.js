import { Router } from 'express';
const router = Router();
import Group from '../../models/Group.js';

router.get('/groups', async (req, res) => {
    try {
        let groups = await find({});
        res.render('groups/index', { groups });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/groups/create', (req, res) => {
    res.render('groups/create');
});

router.post('/groups', async (req, res) => {
    try {
        const { name, notice, text } = req.body;
        let group = new Group({ name, notice, text });
        await group.save();
        res.redirect('/groups');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/groups/:id/edit', async (req, res) => {
    try {
        let group = await findById(req.params.id);
        res.render('groups/edit', { group });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.put('/groups/:id', async (req, res) => {
    try {
        const { name, notice, text } = req.body;
        await findByIdAndUpdate(req.params.id, { name, notice, text });
        res.redirect('/groups');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/groups/:id', async (req, res) => {
    try {
        await findByIdAndDelete(req.params.id);
        res.redirect('/groups');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;
