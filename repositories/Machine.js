import moment from "moment";
import { NOT_FOUND } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import Machine from "../models/Machine.js";
import QrcodeRepository from "./Qrcode.js";
import IssueNotificationRepository from "./IssueNotification.js";

class MachineRepository{
    static async getAllMachines(status){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                if(status){
                    const machines = await Machine.find({status})
                    return resolve(machines)
                }
                const machines = await Machine.find({}).populate([
                    {
                        path: 'zone',
                        ref: 'Zone'
                    },
        
                    {
                        path: 'categories',
                        ref: 'IssueCategory'
                    }
                ])
                return resolve(machines)
            })
        )
    }

    static async getTotalMachinesCount(status){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                if(status){
                    const total = await Machine.countDocuments({status})
                    return resolve(total)
                }
                const total = await Machine.countDocuments({})
                return resolve(total)
            })
        )
    }

    static async getMachineById(machine_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const machine = await Machine.findOne({ _id: machine_id }).populate([
                    {
                        path: 'zone',
                        ref: 'Zone'
                    },
        
                    {
                        path: 'categories',
                        ref: 'IssueCategory'
                    }
                ])

                if(!machine){
                    let machine_not_found_error = new CustomError(`Machine '${machine_id}' does not exist`, NOT_FOUND)
                    return reject(machine_not_found_error)
                }

                return resolve(machine)
            })
        )
    }


    static async createMachine({ serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let lastActiveTime = moment().format('DD.MM.YYYY HH:mm:ss')
                const machine = new Machine({ 
                    serial,zone,shiftNumber,zoneLocation,categories,latitude,longitude,lastActiveTime
                });

                const machine_qrcode = await QrcodeRepository.generateMachineQrcode(machine)
                machine.qrcode = machine_qrcode

                await machine.save();
                return resolve(machine)
            })
        )
    }


    static async deleteAllMachines(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Machine.deleteMany({});
                return resolve(result)
            })
        )
    }


    static async deleteMachineById(machine_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Machine.deleteOne({
                    _id: machine_id
                });
                return resolve(result)
            })
        )
    }

    static async updateMachine({ machine_id, serial,zone,zoneLocation,categories,latitude,longitude, lastActiveTime, totalWorkingTime, status }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const result = await Machine.updateOne({
                    _id: machine_id
                }, { serial,zone,zoneLocation,categories,latitude,longitude, lastActiveTime, totalWorkingTime, status });
                console.log('result', result);
                return resolve(result)
            })
        )
    }

    static async setMachineInWaitingState({ machine_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const machine = await this.getMachineById(machine_id);
                if(!machine){
                    let machine_not_found_error = new CustomError(`Machine '${machine_id}' does not exist`, NOT_FOUND)
                    return reject(machine_not_found_error)
                }
                
                const newLastActiveTime = moment().format('DD.MM.YYYY HH:mm:ss');
                const totalWorkingTime = machine.totalWorkingTime + moment.duration(moment().diff(moment(machine.lastActiveTime))).asHours();
                const result = await this.updateMachine({ status: 'waiting', lastActiveTime: newLastActiveTime, totalWorkingTime });

                await IssueNotificationRepository.storeIssueNotification({
                    title: `Machine ${machine.serial} change status`,
                    body: `Machine  ${machine.zone.name} at address ${machine.zoneLocation} is in waiting state`,
                    notification_type: 'normal'
                })   
                return resolve(result)
            })
        )
    }

    static async setMachineInInactiveState({ machine_id }){

        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const machine = await this.getMachineById(machine_id);

                if(!machine){
                    let machine_not_found_error = new CustomError(`Machine '${machine_id}' does not exist`, NOT_FOUND)
                    return reject(machine_not_found_error)
                }

                let newLastActiveTime = moment().format('DD.MM.YYYY HH:mm:ss')
        
                let lastActiveTime = moment(moment(machine.lastActiveTime).format('DD.MM.YYYY HH:mm:ss'))
                let currentTime = moment(moment().format('DD.MM.YYYY HH:mm:ss'))
        
                let diff = moment.duration(currentTime.diff(lastActiveTime))
                let newTotalTime = machine.totalWorkingTime + diff.asHours()
                const result = await this.updateMachine({
                    machine_id,
                    status: 'inactive', totalWorkingTime: newTotalTime, lastActiveTime: newLastActiveTime 
                })

                await IssueNotificationRepository.storeIssueNotification({
                    title: `Machine ${machine.serial} has issue`,
                    body: `Machine  ${machine.zone.name} at address ${machine.zoneLocation} is broken down`,
                    notification_type: 'issue'
                })   


                return resolve(result)
            })
        )
    }

    static async activateMachine({ machine_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                let machine = await this.getMachineById(machine_id)

                if(!machine){
                    let machine_not_found_error = new CustomError(`Machine '${machine_id}' does not exist`, NOT_FOUND)
                    return reject(machine_not_found_error)
                }
                
                await this.updateMachine({
                    machine_id,
                    status: 'active'
                })
                
                await IssueNotificationRepository.storeIssueNotification({
                    title: `P-Automat ${machine.serial} i orden`,
                    body: `P-Automat på  ${machine.zone.name} i adressen ${machine.zoneLocation} er i orden`,
                    notification_type: 'activation'
                })        
        
                return resolve(true)
            })
        )
    }
}

export default MachineRepository