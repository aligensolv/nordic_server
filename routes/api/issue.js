import { Router } from 'express';
const router = Router();
import IssueNotification from '../../models/IssueNotification.js';
import IssueReport from '../../models/IssueReport.js';
import moment from 'moment';
import SMS from '../../models/SMS.js';
import multer, { diskStorage } from 'multer';
import { launch } from 'puppeteer';
import { readFileSync } from 'fs';
import { createIssue, deleteAllIssues, deleteIssueById, getAllIssues, getAllVerifiedIssues, setIssueInWaitingState } from '../../controllers/issue_controller.js';
import Auth from '../../repositories/Auth.js';
import jwt from 'jsonwebtoken'
import Issue from '../../models/Issue.js';
import Manager from '../../models/Manager.js';
import IssueModel from '../../models/Issue.js';
import puppeteer from 'puppeteer';
import fs from 'fs'
import Handlebars from 'handlebars';
import Machine from '../../models/Machine.js';
import Admin from '../../utils/firebase.js';
import User from '../../models/user.js';
import SmsRepository from '../../repositories/Sms.js';
import { drivers_phone_numbers, manager_phone_number, second_manager_phone_number } from '../../config.js';

const storage = diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder where files will be saved
        cb(null, 'public/images/reports/'); // Create a folder named 'uploads' in your project root
    },
    filename: function (req, file, cb) {
        // Set the file name with original name + timestamp to make it unique
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/issues', getAllIssues)


router.get('/issues/verified', getAllVerifiedIssues)


router.put('/issues/:id/waiting', setIssueInWaitingState)

router.delete('/issues/:id', deleteIssueById)
router.delete('/issues', deleteAllIssues)

router.post('/issues', createIssue)


router.post('/issues/:id/technician/reports', async (req, res) => {
    try{
        const { id } = req.params
        const { token } = req.headers

        let decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)



        let currentIssue = await Issue.findOne({_id: id})
        let currentTech = await Manager.findOne({
            _id: decoded.id
        })


        let currentDate = moment().format('YYYY-MM-DD HH:mm:ss')


        let issue = await IssueModel.findOne({ _id: id })
        issue.status = 'complete'
        issue.fixedAt = currentDate
        issue.processes.push(`issue was fixed and closed by ${currentTech.name} at ${currentDate}`)

        issue.fixedByIdentifier = currentTech.username
        issue.fixedBy = 'technician'

        if(issue.wasInWaitingState){
            issue.WaitingEndTime = currentDate
        }
        await issue.save()

        const browser = await puppeteer.launch({
            headless: 'new',
            args:['--no-sandbox']
        });
        const page = await browser.newPage();

        // Load the HTML template
        const htmlTemplate = fs.readFileSync('templates/machine_fix_report_tech.html', 'utf8');


        // Replace placeholders with dynamic data
        const template_data = {
            clientNotes: currentIssue.notes,
            boardNumber:currentIssue.boardNumber,
            date: currentDate,
            serial: currentIssue.serial,
            zone: currentIssue.zone,
            zoneLocation: currentIssue.zoneLocation,
            username: currentTech.username,
            name: currentTech.name
        };

        const filledTemplate = Handlebars.compile(htmlTemplate)(template_data);
        let up_date = moment().format('YYYY-MM-DD')
        let filename = `technician_machine_fix_report_${up_date}.pdf`

        // Generate PDF from filled template
        await page.setContent(filledTemplate);
        await page.pdf({ path: `./public/profiles/${filename}`,
        
        printBackground: true,

        format: 'A3' });

        await browser.close();

        console.log('Issue updated and closed');

        let machineId = currentIssue.machine

        let machine = await Machine.findOne({
            _id: machineId
        })

        let newLastActiveTime = moment().format('YYYY-MM-DD HH:mm:ss')
        let newTotalTime = machine.totalOfflineTime

        let lastActiveTime = moment(moment(machine.lastActiveTime).format('YYYY-MM-DD HH:mm:ss'))
        let currentTime = moment(moment().format('YYYY-MM-DD HH:mm:ss'))

        let diff = moment.duration(currentTime.diff(lastActiveTime))
        newTotalTime = machine.totalOfflineTime + diff.asHours()

        let machineActivation = await Machine.updateOne({
            _id: machineId,
        },{
            status: 'active',
            lastActiveTime: newLastActiveTime,
            totalOfflineTime: newTotalTime
        })

        if(machineActivation){
            console.log('Machine activated');
        }

        const message = {
            data: {
                title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
                body: `P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentTech.name}`,
                type: 'issue_closed',
            },
            topic: 'dev', // Replace with the topic you want to use
          };
          
          let response = await Admin
            .messaging()
            .send(message)

            // const appNotification = await AppNotification.create({
            //     delivery_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            //     title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
            //     content: ` P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentTech.name}`
            //   })

            await SmsRepository.sendMessage({
                message: `P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentTech.name}`,
                to: manager_phone_number
            })


            await SmsRepository.storeSms({
                sender: 'System',
                delivered_to: [
                    manager_phone_number
                ],
                content: `P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentTech.name}`,
                total_received: 1,
                about: 'Technician uploads fix report',
            })


            return res.status(200).json('issue was successfully closed');
    }catch(error){
        return res.status(500).json(error.message)
    }
})

router.post('/issues/:id/report', upload.single('report') ,async (req, res) => {
    console.log(req.params);
    try{
        const {
            details,
            notes,
            pnid
        } = req.body
        
        console.log(req.body);

        let image = process.env.BASE_URL + req.file.path.split('public')[1].replaceAll('\\','/')
        let currentIssue = await Issue.findOne({_id: req.params.id})
        const currentUser = await User.findOne({
            pnid: pnid,
        })

        let currentDate = moment().format('YYYY-MM-DD HH:mm:ss')


        const browser = await puppeteer.launch({
            headless: 'new',
            args:['--no-sandbox']
        });
        const page = await browser.newPage();

        // Load the HTML template
        const htmlTemplate = fs.readFileSync('templates/machine_fix_report.html', 'utf8');

        // Replace placeholders with dynamic data
        const template_data = {
            details: details,
            notes: notes ,
            clientNotes: currentIssue.notes,
            image,
            boardNumber:currentIssue.boardNumber,
            date: currentDate,
            serial: currentIssue.serial,
            zone: currentIssue.zone,
            zoneLocation: currentIssue.zoneLocation,
            pnid: currentUser.pnid,
            name: currentUser.name
        };

        const filledTemplate = Handlebars.compile(htmlTemplate)(template_data);
        let up_date = moment().format('YYYY-MM-DD')
        let filename = `machine_fix_report_${up_date}.pdf`

        // Generate PDF from filled template
        await page.setContent(filledTemplate);
        await page.pdf({ path: `./public/profiles/${filename}`,
        
        printBackground: true,

        format: 'A3' });

        await browser.close();

        const issueReport = new IssueReport({
            details: details,
            notes: notes,
            created_at: currentDate,
            image: image,
            pdf: process.env.BASE_URL + 'profiles/' + filename,
            serial: currentIssue.serial,
            zone: currentIssue.zone,
            zoneLocation: currentIssue.zoneLocation
        })

        await issueReport.save()

        const issueNotification = new IssueNotification({
            title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
            body: ` P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
            created_at: currentDate,
            notification_type: 'activation'
        })

        await issueNotification.save()

        let issue = await Issue.findOne({ _id: req.params.id })
        issue.status = 'complete'
        issue.fixedAt = currentDate
        issue.processes.push(`issue was fixed and closed by ${currentUser.name} at ${currentDate}`)
        issue.fixedByIdentifier = currentUser.pnid
        issue.fixedBy = 'driver'

        if(issue.wasInWaitingState){
            issue.WaitingEndTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss') 
        }
        await issue.save()

        console.log('Issue updated and closed');

        let machineId = currentIssue.machine
        let machine = await Machine.findOne({
            _id: machineId
        })

        let newLastActiveTime = moment().format('YYYY-MM-DD HH:mm:ss')
        let newTotalTime = machine.totalOfflineTime

        let lastActiveTime = moment(moment(machine.lastActiveTime).format('YYYY-MM-DD HH:mm:ss'))
        let currentTime = moment(moment().format('YYYY-MM-DD HH:mm:ss'))

        let diff = moment.duration(currentTime.diff(lastActiveTime))
        newTotalTime = machine.totalOfflineTime + diff.asHours()

        let machineActivation = await Machine.updateOne({
            _id: machineId,
        },{
            status: 'active',
            lastActiveTime: newLastActiveTime,
            totalOfflineTime: newTotalTime
        })

        if(machineActivation){
            console.log('Machine activated');
        }

        const message = {
            data: {
                title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
                body: ` P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
                type: 'issue_closed',
            },
            topic: 'dev', // Replace with the topic you want to use
          };
          
          let response = await Admin
            .messaging()
            .send(message)

        //     const appNotification = await AppNotification.create({
        //         delivery_date: currentDate,
        //         content: ` P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
        //         title: `P-Autmat ${currentIssue.zoneLocation} er i orden`,
        //       })

            await SmsRepository.sendMessage({
                message: `P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
                to: manager_phone_number
                // to: '4740088605'
            })



            await SmsRepository.storeSms({
                sender: 'System',
                delivered_to: [
                    manager_phone_number,
                ],
                content: `P-Automat i adressen ${currentIssue.zoneLocation} fikset av ${currentUser.name}`,
                total_received: 1,
                about: 'User Upload Fix Report',
            })


        return res.status(200).json({ message: 'PDF generated and saved successfully' });
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: err.message});
    }
})

router.post('/issues/:id/external/notify', async (req,res) =>{
    try{
        const { reason } = req.body

        const issue = await Issue.findOne({
            _id: req.params.id
        })

        let currentDate = moment(moment.now()).format('yyyy-MM-DD HH:mm:ss')

        issue.processes.push(`issue couldn't be fixed and notified managers at ${currentDate}`)
        issue.status = 'redirected'
        issue.statusText = reason

        issue.redirectStartTime = currentDate
        issue.wasRedirected = true
        await issue.save()

        let smsMessageFormatted = `
Feil på P-Automat ${issue.serial}  på ${issue.zoneLocation} ute av drift.

Den trenger teknikker.
Grunn: ${reason}
        `
        await SmsRepository.sendMessage({
            message: smsMessageFormatted,
            to: manager_phone_number
        })

        await SmsRepository.sendMessage({
            message: smsMessageFormatted,
            to: second_manager_phone_number
        })



        await SmsRepository.storeSms({
            sender: 'System',
            delivered_to: [
                manager_phone_number,
                second_manager_phone_number
            ],
            content: smsMessageFormatted,
            total_received: 2,
            about: 'issue redirected by driver',
        })



        let driversFormattedMessage = 
`
Hei,
Ikke kontroll på ${issue.zoneLocation} til nærmere beskjed.

Drift, Parknordic
`

for(let driver of drivers_phone_numbers){
    await SmsRepository.sendMessage({
        message: driversFormattedMessage,
        to: driver
    })
}

await SmsRepository.storeSms({
    sender: 'System',
    delivered_to: drivers_phone_numbers,
    content: driversFormattedMessage,
    total_received: drivers_phone_numbers.length,
    about: 'issue redirected by driver',
})


        return res.status(200).json({message: smsMessageFormatted})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message});
    }
})

export default router;
