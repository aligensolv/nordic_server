import { Router } from 'express'
const router = Router()
import PostalScan from '../../models/PostalScan.js'
import Handlebars from 'handlebars'
import { launch } from 'puppeteer'
import multer, { diskStorage } from 'multer'
import path from 'path'
import { readFileSync } from 'fs'
import moment from 'moment'
import { static_absolute_files_host } from '../../config.js'
import Randomstring from 'randomstring'
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/drivers/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.get('/scans',async (req,res) =>{
  try{
    let scans = await find()
    return res.status(200).json(scans)
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.post('/scans',upload.single('violation'),async (req,res) =>{
  try{
    console.log(req.body)
    const {
      number,
      pnid,
      reason
    } = req.body

    const browser = await launch({
      headless: 'new',
      args:['--no-sandbox']
    });
    const page = await browser.newPage();

    // Load the HTML template
    const htmlTemplate = readFileSync('templates/scan.html', 'utf8');
    


    const current_date = moment().format('DD.MM.YYYY HH:mm:ss');
    const image_link = req.file != null ? static_absolute_files_host + 'images/drivers/' + req.file.filename : null

    const template_data = {
      pnid: pnid,
      number: number,
      reason: decodeURIComponent(reason),
      date: current_date,
      image: image_link
    
      
  };
  const filledTemplate = Handlebars.compile(htmlTemplate)(template_data);
  let filename = `makul_${pnid}_${Randomstring.generate(10)}.pdf`

  // Generate PDF from filled template
  await page.setContent(filledTemplate);
  await page.pdf({ path: `./public/postals/${filename}`,
  
  printBackground: true,

  format: 'A0' });
    let postal = new PostalScan({
      violationNumber: number,
      pnid: pnid,
      date: current_date,
      reason: decodeURIComponent(reason),
      link: static_absolute_files_host + 'postals/' + filename,
      image: image_link
    })

    console.log(postal);

    await postal.save()
    await browser.close();
    return res.sendStatus(200)
  }catch(error){
    console.log(error.message);
    return res.status(500).json(error.message)
  }
})

router.put('/scans/:id',async (req,res) =>{
  try{
    await updateOne({ _id: req.params.id },req.body)
    return res.sendStatus(200)
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.delete('/scans/:id',async (req,res) =>{
  try{
    await deleteOne({ _id: req.params.id })
    return res.sendStatus(200)
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.delete('/scans',async (req,res) =>{
  try{
    await deleteMany({})
    return res.sendStatus(200)
  }catch(error){
    return res.status(500).json(error.message)
  }
})


export default router