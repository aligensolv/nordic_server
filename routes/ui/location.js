import { Router } from 'express'
const router = Router()
import LocationRepository from '../../repositories/Location.js'
import { OK } from '../../constants/status_codes.js'

router.get('/locations',async (req,res) =>{
    try{

        let locations = await LocationRepository.getAllLocations()

        return res.status(200).render('location/index',{
            locations
        })
    }catch (error){
        return res.status(500).render('errors/internal',{
            error: error.message
        })
    }
})

router.get('/locations/create',async (req,res) =>{

    return res.status(OK).render('location/create')
})

router.get('/locations/:id/update', async (req,res) =>{
    try{

        let location = await LocationRepository.getLocationById(req.params.id)
        return res.status(OK).render('location/update',{
            location,
        })
    }catch (error){
        return res.status(500).render('errors/internal',{
            error:error.message
        })
    }
})

export default router