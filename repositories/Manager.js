import { FORBIDDEN, NOT_FOUND } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Manager from "../models/Manager.js";
import Auth from "./Auth.js";

class ManagerRepository{
    static async createManager({ name, username, password, role, permissions }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const hashed_password = await Auth.encryptPassword(password);

                let manager = await Manager.create({
                    username, name, role,
                    password: hashed_password,
                    permissions: role == 'manager' ? permissions : [{
                        route: 'machines',
                        method: 'GET'
                    }]
                })

                return resolve(manager)
            })
        )
    }

    static async getAllManagers(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const managers = await Manager.find({})
                return resolve(managers)
            })
        )
    }


    static async getManagerById(manager_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const manager = await Manager.findById(manager_id)
                return resolve(manager)
            })
        )
    }


    static async deleteManagerById(manager_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const manager = await this.getManagerById(manager_id)
                if(!manager){
                    let manager_not_found_error = new CustomError(`Manager '${manager_id}' does not exist`, NOT_FOUND)
                    return reject(manager_not_found_error)
                }

                if(manager.role === 'admin'){
                    let manager_not_found_error = new CustomError(`Admin can not be deleted, Forbidden`, NOT_FOUND)
                    return reject(manager_not_found_error)
                }

                await Manager.deleteOne({
                    _id: manager_id
                })
                return resolve(manager)
            })
        )
    }


    static async updateManager({ name, username, password, role, permissions, manager_id, token }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const decoded = await Auth.verifyToken(token)
                const manager = await Manager.findOne({ _id: manager_id })

                if(manager.role === 'admin' && decoded.role != 'admin'){
                    let manager_not_found_error = new CustomError(`Admin can not be updated by manager, Forbidden`, FORBIDDEN)
                    return reject(manager_not_found_error)
                }

                const hashed_password = password ? await Auth.encryptPassword(password) : manager.password
                let updated = await Manager.updateOne({
                    _id: manager_id
                }, { name, username, role, password: hashed_password, permissions })


                return resolve(updated)
            })
        )
    }


    static async deleteAllManagers(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const managers = await Manager.deleteMany({})
                return resolve(managers)
            })
        )
    }

    static async loginTechnician({ username, password }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const technician = await Manager.findOne({ 
                    username
                });

                if (!technician) {
                    let technician_not_found_error = new CustomError(`Technician '${username}' does not exist`, NOT_FOUND)
                    return reject(technician_not_found_error)
                }

                const isMatch = await Auth.decryptAndCheckPasswordMatch({
                    normal: password,
                    hashed: technician.password
                });

                if (!isMatch) {
                    let password_not_match_error = new CustomError(`Password does not match`, NOT_FOUND)
                    return reject(password_not_match_error)
                }

                const token = await Auth.generateToken({
                    id: technician._id,
                    role: technician.role
                })

                return resolve({
                    token,
                    technician
                })
            })
        )
    }
}

export default ManagerRepository