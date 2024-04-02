import { Router } from 'express'
const router = Router()
import ZoneRepository from '../../repositories/Zone.js'
import { OK } from '../../constants/status_codes.js'

router.get('/zones',async (req,res) =>{
  try{

    let zones = await ZoneRepository.getAllZones()
    return res.status(OK).render('zones/index',{ zones })

  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/zones/:id/edit',async (req,res) =>{
  try{

    let zone = await ZoneRepository.getZoneById(req.params.id)
    return res.status(200).render('zones/edit',{ zone })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/zones/new',async (req,res) =>{
  try{

    return res.status(200).render('zones/create')
  }catch(error){
    return res.status(500).json(error.message)
  }
})

export default router