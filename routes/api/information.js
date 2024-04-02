import { Router } from 'express'
const router = Router()
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
router.get('/info/car',async (req,res) =>{
  try{
    let applicationData = readFileSync(path.join(__dirname,'../../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)

     console.log(applicationJson);

     return res.status(200).send(applicationJson.car)
  }catch(error){
    return res.status(500).send(error.message)
  }
})

router.get('/info/shift',async (req,res) =>{
  try{
    let applicationData = readFileSync(path.join(__dirname,'../../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)
     console.log(applicationJson)

     return res.status(200).send(applicationJson.shift)
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/info/kilometer',async (req,res) =>{
  try{
    let applicationData = readFileSync(path.join(__dirname,'../../data/application.json'),{ 
      encoding: 'utf8',
      flag: 'r'
     })
     let applicationJson = JSON.parse(applicationData)

     return res.status(200).send(applicationJson.kilometer)
  }catch(error){
    return res.status(500).send(error.message)
  }
})

import Pdf from '../../models/PDF.js'
import User from '../../models/user.js'
import Accident from '../../models/Accident.js'

router.get('/info/pdfs', async (req,res) =>{
  try{
    const count = await Pdf.countDocuments();
    console.log(count)
    return res.status(200).json(count)
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/info/users', async (req,res) =>{
  try{
    const count = await User.count();
    return res.status(200).json(count)
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

router.get('/info/accidents', async (req,res) =>{
  try{
    const count = await Accident.count();
    return res.status(200).json(count)
  }catch(error){
    console.log(error.message)
    return res.status(500).send(error.message)
  }
})

export default router