import * as bcrypt from "bcrypt";
import UserRepository from "./User.js";
import jwt from "jsonwebtoken"
import { jwt_secret_key } from '../config.js'
import CustomError from "../interfaces/custom_error_class.js";
import { BAD_REQUEST, NOT_FOUND } from "../constants/status_codes.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";


class Auth{
    static encryptPassword(password){
        return new Promise(promiseAsyncWrapper(
            async (resolve) =>{
                let hashedPassword = await bcrypt.hash(password,10)
                return resolve(hashedPassword)
            }
        ))
    }

    static decryptAndCheckPasswordMatch({ normal, hashed }){
        return new Promise(promiseAsyncWrapper(
            async (resolve) =>{
                let isMatch = await bcrypt.compare(normal,hashed)    
                return resolve(isMatch)
            }
        ))
    }

    static generateToken(data, expiresIn = '3h'){
        return new Promise(promiseAsyncWrapper(
            async (resolve) =>{
                let token = jwt.sign(
                    data,
                    jwt_secret_key,
                    {expiresIn}
                )
                return resolve(token)
            }
        ))
    }

    static verifyToken(token){
        return new Promise(promiseAsyncWrapper(
            async (resolve) =>{
                let decoded = jwt.verify(token,jwt_secret_key)
                return resolve(decoded)
            }
        ))
    }

    static login(credentials){
        return new Promise(promiseAsyncWrapper(
            async (resolve, reject) =>{
                let user = await UserRepository.getUserByIdentifier(credentials.identifier)
                if(!user){
                    let not_found_error = new CustomError(`User '${credentials.identifier}' does not exist`, NOT_FOUND)
                    return reject(not_found_error)
                }
    
                let isMatch = await this.decryptAndCheckPasswordMatch(credentials.password,user.password)
    
                if(!isMatch){
                    let password_not_match_error = new CustomError('Password mismatch', BAD_REQUEST)
                    
                    return reject(password_not_match_error)
                }
    
    
                let token = jwt.sign(
                    {username: user.name,id: user._id,role: 'user'},
                    jwt_secret_key,
                )
    
    
                return resolve({
                    token: token,
                    user: user
                })
            }
        ))
    }
}

export default Auth