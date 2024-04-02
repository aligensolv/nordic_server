import { Router } from 'express'
const router = Router()
import { readFileSync } from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/settings',async (req,res) =>{

  let emailData = readFileSync(path.join(__dirname,'../../data/email.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })

   let smsData = readFileSync(path.join(__dirname,'../../data/sms.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })


   let applicationData = readFileSync(path.join(__dirname,'../../data/application.json'),{ 
    encoding: 'utf8',
    flag: 'r'
   })

   let emailJson = JSON.parse(emailData)
   let smsJson = JSON.parse(smsData)
   let applicationJson = JSON.parse(applicationData)


  return res.status(200).render('settings/index',{
    email_template: emailJson.text,
    email_subject: emailJson.subject,

    sms_template: smsJson.text,

    kilometer: applicationJson.kilometer,
    car: applicationJson.car,
    shift: applicationJson.shift
  })
})


export default router