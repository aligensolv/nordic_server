import { Router } from 'express';
const router = Router();
import IssueNotification from '../../models/IssueNotification.js';
import jwt from 'jsonwebtoken';
import Manager from '../../models/Manager.js';

router.get('/issues/notifications', async (req, res) => {

    
    const issuenotifications = await find()

    res.render('issueNotifications/index', { 
        issuenotifications: issuenotifications.reverse() ,
    });
});

export default router;