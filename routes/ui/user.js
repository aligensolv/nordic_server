import { Router } from 'express'
const router = Router()
import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import Manager from '../../models/Manager.js'
import uiAsyncWrapper from '../../middlewares/front_async_wrapper.js'
import Auth from '../../repositories/Auth.js'
import ManagerRepository from '../../repositories/Manager.js'
import logger from '../../utils/logger.js'


router.get('/users', uiAsyncWrapper(
    async  (req,res) =>{
        let jwt_access_token = req.cookies.jwt_token
        let decoded = jwt.verify(jwt_access_token,process.env.JWT_SECRET_KEY)
        let manager = await Manager.findOne({ _id: decoded.id })
        let users = await User.find({})
        
        return res.status(200).render('users/read',{
            users: users,
            isAdmin: decoded.role == 'admin',
            permissions: decoded.role === 'admin' ? [] : manager.permissions
        })
}
))

router.get('/users/create', uiAsyncWrapper(
    async (req,res) =>{
        let jwt_access_token = req.cookies.jwt_token
        let decoded = jwt.verify(jwt_access_token,process.env.JWT_SECRET_KEY)
        let manager = await Manager.findOne({ _id: decoded.id })
        return res.status(200).render('users/create',{
            isAdmin: decoded.role === 'admin',
            permissions: manager.permissions
        })
    }
))

router.get('/users/:id/violations', async (req,res) =>{

    return res.status(200).render('users/violations',{
        pnid: req.params.id
    })
})

router.get('/users/:id/edit', async (req,res) =>{
    try{
    let decoded = Auth.verifyToken(req.cookies.jwt_token)
    
    let manager = await Manager.findOne({ _id: decoded.id })

        let user = await User.findOne({ _id: req.params.id })
        return res.status(200).render('users/update',{
            user: user,
            isAdmin: decoded.role === 'admin',
      permissions: []
        })
    }catch (error){
        return res.status(500).json(error.message)
    } 
})

export default router