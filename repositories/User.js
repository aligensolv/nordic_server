import moment from 'moment';
import { NOT_FOUND } from '../constants/status_codes.js';
import CustomError from '../interfaces/custom_error_class.js';
import promiseAsyncWrapper from '../middlewares/promise_async_wrapper.js';
import User from '../models/user.js'
import Auth from './Auth.js';

class UserRepository{
    static async getAllUsers(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const users = await User.find({});
                return resolve(users)
            })
        )
    }


    static async getUserById(user_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const user = await User.findOne({
                    _id: user_id
                });

                if(!user){
                    let user_not_found_error = new CustomError(`User '${user_id}' does not exist`, NOT_FOUND)
                    return reject(user_not_found_error)
                }

                return resolve(user)
            })
        )
    }

    static async getUserByAccounId(pnid){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const user = await User.findOne({
                    pnid: pnid
                });

                if(!user){
                    let user_not_found_error = new CustomError(`User '${pnid}' does not exist`, NOT_FOUND)
                    return reject(user_not_found_error)
                }
                return resolve(user)
            })
        )
    }

    static async deleteUser(user_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const user = await User.deleteOne({
                    _id: user_id
                });

                if(user.deletedCount === 0){
                    let user_not_found_error = new CustomError(`User '${user_id}' was not deleted`, NOT_FOUND)
                    return reject(user_not_found_error)
                }
                return resolve(user)
            })
        )
    }

    static async updateUser({ user_id, data }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const user = await User.updateOne({
                    _id: user_id
                }, data);
                return resolve(user)
            })
        )
    }

    static async deleteAllUsers(){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const users = await User.deleteMany({});
                return resolve(users)
            })
        )
    }

    static async login(pnid, password){
        return new Promise(async (resolve, reject) => {
            const user = await User.findOne({ pnid: pnid });

            if (!user) {
                let user_not_found_error = new CustomError(`User '${pnid}' does not exist`, NOT_FOUND)
                return reject(user_not_found_error);
            }

            const isMatch = await Auth.decryptAndCheckPasswordMatch({ normal: password, hashed: user.password });
            if (!isMatch) {
                let password_not_match_error = new CustomError('Password mismatch', BAD_REQUEST)
                return reject(password_not_match_error);
            }

            const token = await Auth.generateToken({ 
                id: user._id,
                username: user.username,
                pnid: user.pnid,
            });

            return resolve({
                user,
                token
            });
        })
    }

    static async register({ pnid, name, password }){
        return new Promise(async (resolve, reject) => {
            const existingUser = await User.findOne({ pnid: pnid });

            if (existingUser) {
                let user_exists_error = new CustomError(`User '${pnid}' already exists`, NOT_FOUND)
                return reject(user_exists_error);
            }

            const hashedPassword = await Auth.encryptPassword(password, 10);
            const created_at = moment().format('DD-MM-YYYY HH:mm:ss');
            const newUser = new User({
                pnid: pnid,
                name: name,
                password: hashedPassword,
                created_at: created_at
            });

            const savedUser = await newUser.save();

            return resolve(savedUser);
        })
    }

    static async validateToken (token){
        return new Promise(promiseAsyncWrapper(
            async (resolve) => {
                const decoded = await Auth.verifyToken(token);
                return resolve(decoded);
            }
        ))
    }

}

export default UserRepository