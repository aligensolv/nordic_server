import { Router } from 'express';
const router = Router();
import IssueNotification from '../../models/IssueNotification.js';

router.get('/issues/notifications', async (req, res) => {

    
    const issuenotifications = await IssueNotification.find()

    res.render('issueNotifications/index', { 
        issuenotifications: issuenotifications.reverse() ,
    });
});

export default router;