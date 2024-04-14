import { Router } from 'express'
import { OK } from '../../constants/status_codes.js'
import ImeiRepository from '../../repositories/Imei.js'
const router = Router()

router.get('/imeis',async (req,res) =>{
  try{

    let imeis = await ImeiRepository.getAllImeis()
    
    return res.status(OK).render('imeis/index',{
      imeis
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/imeis/:id/edit',async (req,res) =>{
  try{

    let imei = await ImeiRepository.getImeiById(req.params.id)
    return res.status(OK).render('imeis/edit',{ imei })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/imeis/create',async (req,res) =>{
  try{

    return res.status(OK).render('imeis/create')
  }catch(error){
    return res.status(500).json(error.message)
  }
})

export default router