import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../config.js';

const authenticate_front = (req,res,next) => {
    try{
        if(req.url.includes('login')){
            return next()
        }

        let jwt_token = req.cookies.jwt_token
        let decoded = jwt.verify(jwt_token,jwt_secret_key)
        let isLogged = req.cookies.is_logged

        if(decoded && isLogged == 'true'){
            return next()
        }
        
        // return res.render('errors/401',{
        //     url: req.url
        // })
    }catch(e){
        return res.redirect('/login')
    }
}

export default authenticate_front