import { Router } from 'express'
const router = Router()
import Car from '../../models/Car.js'
import jwt from 'jsonwebtoken'
import Manager from '../../models/Manager.js'
import CarRepository from '../../repositories/Car.js'

router.get('/cars', async (req,res) =>{
  try{
    let cars = await Car.find({})
    return res.status(200).render('car/index',{
      cars:cars
    })
  }catch (error){
    return res.send(`<h1>Internal Server Error 500</h1><br /> <h2>${error.message}</h2>`)
  }
})
// router.get('/cars/:id')
router.get('/cars/create', async (req,res) =>{
  return res.status(200).render('car/create')
})

router.get('/cars/:id/update', async (req,res) =>{
  try{

    let car = await CarRepository.getCarById(req.params.id)
    return res.status(200).render('car/update',{
      car
    })
  }catch (error){
    return res.status(500).render('errors/internal',{
      error: error.message
    })
  }
})

router.get('/cars/:id/qrcode', async (req,res) =>{
  try{
    let car = await CarRepository.getCarById(req.params.id)
    console.log(car);
    return res.status(200).render('car/car_qrcode_view',{
      car
    })
  }catch (error){
    return res.status(500).render('errors/internal',{
      error: error.message
    })
  }
})
// router.get('/cars/update')

export default router
