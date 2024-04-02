import { compare } from 'bcrypt';
import { NOT_FOUND } from './constants/status_codes.js';

import jwt from 'jsonwebtoken';
import Manager from './models/Manager.js';
import ErrorHandlerMiddleware from './middlewares/error_handler.js'
import ValidateApiToken from './middlewares/validate_api_token.js'
import Violation from './models/Violation.js';
import { host, jwt_secret_key, port } from './config.js';
import express from 'express';
import bodyParser from 'body-parser';
import PDFArchieve from './models/PdfArchieve.js';
import Pdf from './models/PDF.js';
import { authorize_front, authorize_admin_api } from './middlewares/authorize.js';
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './utils/logger.js'
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(cookieParser())

app.use(cors())

app.use(express.static(path.join(__dirname, './public')))
app.set('view engine', 'ejs')


app.get('/login', (req,res) =>{
    return res.status(200).render('auth/login')
})


app.get('/rp', async (req, res) => {
    return res.status(200).render('issues/create_issue')
})



app.get('/archieve',async (req,res) =>{
    let jwt_access_token = req.cookies.jwt_token
    let decoded = jwt.verify(jwt_access_token,jwt_secret_key)
    let manager = await findOne({ _id: decoded.id })

    let archieves = await find({})
    return res.status(200).render('pdfArchieve/pdf_list',{
        pdfs: archieves,
        isAdmin: decoded.role === 'admin',
      permissions: manager.permissions
    })
})

app.post('/api/archieves', async (req,res) =>{
    try{
        let pdfs = await Pdf.find({})

        for(let pdf of pdfs){
            try{
                let pop = await pdf.populate({
                    path: 'userId',
                    ref: 'User'
                })
                
                if(pdf == null){
                    continue
                }
    
                let isExisting = await _findOne({
                    accountId: pdf.userId.accountId,
                    link:pdf.link,
                    createdAt:pdf.createdAt
                })
    
                if(!isExisting){
                    continue;
                }
    
                let archieve = new PDFArchieve({
                    name:pdf.name,
                    username:pdf.userId.name,
                    accountId:pdf.userId.accountId,
                    link:pdf.link,
                    createdAt:pdf.createdAt,
                })
    
                await archieve.save()
            }catch(err){
                continue
            }
        }

        return res.sendStatus(200) 
    }catch(error){
        return res.status(500).json(error.message)
    }
})

app.get('/archieves/:id', async (req, res) => {
    try {
        let jwt_access_token = req.cookies.jwt_token
    let decoded = verify(jwt_access_token,process.env.JWT_SECRET_KEY)
    let manager = await findOne({ _id: decoded.id })

        const pdf = await findById(req.params.id);
        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }
        let link = pdf.link.split('.in')[1]
        return res.status(200).render('pdfArchieve/pdf_show.ejs', { 
            link,
            isAdmin: decoded.role === 'admin',
      permissions: manager.permissions
         });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/api/logout',(req,res) =>{

    res.cookie('is_logged',{
        expires: Date.now()
    })

    res.cookie('jwt_token',{
        expires: Date.now()
    })

    return res.redirect('/')
})

app.post('/api/login', async (req,res) =>{
    const { username, password } = req.body
    const manager = await Manager.findOne({ username });

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const isMatch = await Auth.decryptAndCheckPasswordMatch({
        normal: password,
        hashed: manager.password
    });

    if (isMatch) {
      const token = jwt.sign(
        { 
            id: manager._id,
            role: manager.role,
        },
        jwt_secret_key
      );

        // Cookie expiration time in milliseconds (3 hours in this case)
        res.cookie('is_logged','true',{
            maxAge: 1000 * 60 * 60 * 3, 
            httpOnly: true,
        })

        // Cookie expiration time in milliseconds (3 hours in this case)
        res.cookie('jwt_token', token,{
            maxAge: 1000 * 60 * 60 * 3,
            httpOnly: true,
        })  

        return res.status(200).json({
            role: manager.role,
            permissions: manager.permissions
        })
    } else {
      return res.status(401).json('Invalid password');
    }
})




import driverRouter from './routes/api/driver_report.js';
import groupRouter from './routes/api/group.js';
import fieldRouter from './routes/api/field.js';

import UserApi from './routes/api/users.js';
import ComplaintApi from './routes/api/complaint.js';

import pdfRouter from './routes/api/pdf.js';
import carRouter from './routes/api/car.js';
import locationRouter from './routes/api/location.js';
import settingsRouter from './routes/api/settings.js';
import violationRouter from './routes/api/violation.js';
import informationRouter from './routes/api/information.js';
import accidentRouter from './routes/api/accident.js';
import vpsRouter from './routes/api/vps.js';
import zoneRouter from './routes/api/zone.js';
import imeiRouter from './routes/api/imei.js';
import postalRouter from './routes/api/postal.js';
import map from './routes/api/map.js';
import notificationRouter from './routes/api/notification.js';
import scanRouter from './routes/api/scan.js';
import machinesRouter from './routes/api/machine.js';
import issuesRouter from './routes/api/issue.js';
import issueCategoriyRoute from './routes/api/issue_category.js';
import reportRouter from './routes/api/issue_report.js';
import issueReportRouter from './routes/api/issueReportRoute.js';

import ManagerRoute from './routes/api/manager.js';


app.use(
    '/api',
    vpsRouter,
    reportRouter,
    issuesRouter,
    machinesRouter,
    scanRouter,
    notificationRouter,
    map,
    postalRouter,
    ManagerRoute,
    violationRouter,
    accidentRouter,
    informationRouter,
    driverRouter,
    settingsRouter,
    groupRouter,
    fieldRouter,
    UserApi,
    ComplaintApi,
    pdfRouter,
    carRouter,
    locationRouter,
    imeiRouter,
    zoneRouter,
    issueReportRouter,
    issueCategoriyRoute
    )
    

import driverFront from './routes/ui/driver.js';
import groupFront from './routes/ui/group.js';
import fieldFront from './routes/ui/field.js';
import pdfFront from './routes/ui/pdf.js';
import UserUi from './routes/ui/user.js';
import carFront from './routes/ui/car.js';
import locationFront from './routes/ui/location.js';
import settingsFront from './routes/ui/settings.js';
import zonesFront from './routes/ui/zone.js';
import imeiFront from './routes/ui/imei.js';
import postalFront from './routes/ui/postal.js';
import mapFront from './routes/ui/map.js';
import notificationFront from './routes/ui/notification.js';
import scanFront from './routes/ui/scan.js';
import machineFront from './routes/ui/machine.js';
import issueNotificationFront from './routes/ui/issue_notification.js';
import issueReportFront from './routes/ui/issue_report.js';
import managerFront from './routes/ui/manager.js';
import issuesFront from './routes/ui/issue_category.js';

import authenticate_front from './middlewares/authenticate.js';

import ComplaintUi from './routes/ui/complaints.js';


app.use(
    authenticate_front,
    // authorize_front,
    issuesFront,
    mapFront,
    managerFront,
    scanFront,
    issueNotificationFront,
    notificationFront,
    issueReportFront,
    machineFront,
    settingsFront,
    driverFront,
    postalFront,
    groupFront,
    fieldFront,
    pdfFront,
    UserUi,
    carFront,
    locationFront,
    zonesFront,
    ComplaintUi,
    imeiFront
)

import ComplaintsUi from './routes/ui/complaints.js'
import Auth from './repositories/Auth.js';

app.use(ComplaintsUi)



app.get('/',async (req,res) =>{
    let violations = await Violation.find({});

const combinedViolations = violations.reduce((result, v) => {
    const existingEntry = result.find(entry => entry.date === v.createdAt);
    if (existingEntry) {
        existingEntry.value += v.violations;
    } else {
        result.push({
            date: v.createdAt,
            value: v.violations
        });
    }
    return result;
}, []);

    console.log(combinedViolations)

    const violationsJSON = JSON.stringify(combinedViolations);

    return res.status(200).render('index',{
        violations: violationsJSON
    })
})

app.use(ErrorHandlerMiddleware)

app.get('*', (req, res) => {
    return res.status(NOT_FOUND).json({
        error: '404 Not Found',
        url: req.url
    })
})

const main = async () => {
    try{
        let lib = await import('./utils/database_connection.js')
        if(await lib.default){
            app.listen(port, () => console.log(`[server] listening on ${host}:${port}`))
        }
    }catch(err){
        logger.error(err.message)
    }
}
main()

