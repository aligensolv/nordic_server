import { Router } from 'express';
const router = Router();
import IssueNotification from '../../models/IssueNotification.js';
import jwt from 'jsonwebtoken';
import Manager from '../../models/Manager.js';

router.get('/issues/notifications', async (req, res) => {
    let jwt_access_token = req.cookies.jwt_token
    let decoded = verify(jwt_access_token,process.env.JWT_SECRET_KEY)
    let manager = await findOne({ _id: decoded.id })

    
    const issuenotifications = await find()

    res.render('issueNotifications/index', { 
        issuenotifications: issuenotifications.reverse() ,
        isAdmin: decoded.role === 'admin',
        permissions: manager.permissions
    });
});

export default router;