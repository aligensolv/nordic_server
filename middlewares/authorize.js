import jwt from 'jsonwebtoken'
import Manager from '../models/Manager.js'
import { jwt_secret_key } from '../config.js'

export const authorize_front = async (req, res, next) => {
    try{
        if(req.url.includes('login')){
            return next()
        }

        let jwt_token = req.cookies.jwt_token
        let decoded = jwt.verify(jwt_token,jwt_secret_key)

        let manager = await Manager.findOne({
            _id: decoded.id
        })

        if(decoded.role == 'manager' && req.url == '/managers/dashboard'){
            return next()
        }

        let permissions = manager.permissions
        if(
            permissions.some(p => req.url.includes(p.route) && p.method == 'GET')
            || decoded.role == 'admin'
        ){
            return next();
        }else{
            let error = 
`
            Unauthorized access to page with url ${req.url}
`
            return res.status(401).render('errors/401', {
                error 
            })
        }
        
    }catch(e){
        return res.redirect('/login')
    }
}

export const authorize_admin_api = async (req, res, next) =>{
    try{
        let jwt_token = req.cookies.jwt_token
        let decoded = verify(jwt_token,jwt_secret)

        let manager = await findOne({
            _id: decoded.id
        })

        // if(req.method == 'GET'){
        //     console.log(`yes it was A GET method ${req.method} at ${req.url}`);
        // }

        console.log(`yes it was A method ${req.method} at ${req.url}`);


        let routes = manager.permissions
        if(
            routes.some(r => req.url.includes(r.route) && r.method == req.method && req.method != 'GET')
            || decoded.role == 'admin'
        ){
            return next();
        }else{
            let error = 
`
            Unauthorized action
`

console.log(error);
            return res.status(401).json(error)
        }
        
    }catch(e){
        return res.redirect('/login')
    }
}
