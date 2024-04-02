import { Router } from 'express'
const router = Router()

import { restartVPS, updateNordic, prepareBackup } from '../../utils/vps_service.js'


router.get('/vps/restart',(req,res) =>{
  try{
    restartVPS()
    return res.sendStatus(200)
  }catch(error){
    console.log(error.message)
  }
})

router.get('/vps/update',(req,res) =>{
  try{
    updateNordic()
    return res.sendStatus(200)
  }catch(error){
    console.log(error.message)
  }
})

router.get('/vps/backup/prepare',async (req,res) =>{
  try{
    prepareBackup()
    return res.sendStatus(200)
  }catch(error){
    return res.status(500).send(error.message)
  }
})


export default router