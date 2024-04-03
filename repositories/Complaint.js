import moment from "moment"
import { INTERNAL_SERVER, NOT_FOUND } from "../constants/status_codes.js"
import CustomError from "../interfaces/custom_error_class.js"
import promiseAsyncWrapepr from "../middlewares/promise_async_wrapper.js"
import Complaint from "../models/Complaint.js"
import QrcodeRepository from "./Qrcode.js"
import Auth from "./Auth.js"
import SmsRepository from "./Sms.js"
import UserRepository from "./User.js"
import { manager_phone_number } from "../config.js"
import NotificationManager from "./NotificationManager.js"

class ComplaintRepository{
    static async getAllComplaints(status){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                if(status){
                    const complaints = await Complaint.find({status}, {__v: 0})
                    return resolve(complaints)
                }

                const complaints = await Complaint.find({}, {__v: 0})
                return resolve(complaints)
            })
        )
    }

    static async getComplaintById(id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const complaint = await Complaint.findById(id, {__v: 0})

                if(!complaint){
                    let complaint_not_found_error = new CustomError('Complaint not found', NOT_FOUND)
                    return reject(complaint_not_found_error)
                }

                return resolve(complaint)
            })
        )
    }

    static async getAllClientComplaints(national_id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const complaints = await Complaint.find({national_id: national_id})

                return resolve(complaints)
            })
        )
    }


    static async createComplaint({ type, phone_number, location, image, other_type_description, is_following }){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {

                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')
                const createdComplaint = await Complaint.create({
                    phone_number, location, image,
                    type: type.toLowerCase() == 'other' ? other_type_description : type,
                    is_following,
                    created_at: created_at
                })

                if(!createdComplaint){
                    let complaint_not_found_error = new CustomError('Failed to create complaint', INTERNAL_SERVER)
                    return reject(complaint_not_found_error)
                }

                await SmsRepository.sendMessage({
                    to: manager_phone_number,
                    message: `Complaint was requested at ${location.address}`
                })

                await SmsRepository.storeSms({
                    phone_number: manager_phone_number,
                    content: `Complaint was requested at ${location.address}`,
                    about: 'Complaint',
                    sender: 'System',
                    total_received: 1
                })

                await NotificationManager.sendNotificaitonToAllUsers({
                    title: 'Complaint Requested',
                    body: `Complaint was requested at ${location.address}`
                })

                return resolve(createdComplaint)
            })
        )
    }

    static async deleteAllComplaints(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const deletedComplaints = await Complaint.deleteMany()
                return resolve(deletedComplaints)
            })
        )
    }

    static async deleteComplaintById(id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const deletedComplaint = await Complaint.deleteOne({
                    _id: id
                })

                if(deletedComplaint.deletedCount == 0){
                    let complaint_not_found_error = new CustomError('Failed to delete complaint', INTERNAL_SERVER)
                    return reject(complaint_not_found_error)
                }
                return resolve(deletedComplaint)
            })
        )
    }

    static async generateComplaintQrCode(location){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const complaint_qrcode = await QrcodeRepository.generateComplaintQrcode(location)
                //TODO 

                return resolve(true)
            })
        )
    }

    static async loginClient(national_id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const access_token = await Auth.generateToken({
                    national_id: national_id,
                    role: 'client'
                }, '1d')


                return resolve(access_token)
            })
        )
    }

    static async updateComplaint({ 
        complaint_id, status, accepted_at, accepted_by, completed_at, completed_by, 
        was_solved, was_violated, violation_image, not_violated_reason, 
        total_waiting_time, total_complete_time
    }){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const updatedComplaint = await Complaint.updateOne({_id: complaint_id },{
                    status,accepted_at,accepted_by,completed_at,completed_by,
                    was_solved, was_violated, violation_image, not_violated_reason,
                    total_waiting_time, total_complete_time
                })
                return resolve(updatedComplaint)
            })
        )
    }

    static async acceptComplaint({ complaint_id, user_id }){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const user = await UserRepository.getUserById(user_id)
                const complaint = await this.getComplaintById(complaint_id)
                const total_waiting_time = Math.floor(
                    moment(moment(),'DD.MM.YYYY HH:mm:ss').diff(moment(complaint.created_at, 'DD.MM.YYYY HH:mm:ss'), 'minutes', true)
                )

                const updatedComplaint = await this.updateComplaint({
                    complaint_id, 
                    status: 'accepted',
                    accepted_at: moment().format('DD.MM.YYYY HH:mm:ss'),
                    total_waiting_time,
                    accepted_by: {
                        name: user.name,
                        pnid: user.pnid,
                        user_id
                    }
                });
                return resolve(updatedComplaint)
            })
        )
    }

    static async completeComplaint({ complaint_id, user, violation_image, not_violated_reason, was_solved, was_violated }){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const completed_at = moment().format('DD.MM.YYYY HH:mm:ss')
                const complaint = await this.getComplaintById(complaint_id)
                const total_complete_time = Math.floor(
                    moment(moment(),'DD.MM.YYYY HH:mm:ss').diff(moment(complaint.created_at, 'DD.MM.YYYY HH:mm:ss'), 'minutes', true)
                )


                const updatedComplaint = await this.updateComplaint({
                    complaint_id, 
                    status: 'completed', 
                    total_complete_time,
                    completed_at, 
                    completed_by: {
                        name: user.name,
                        pnid: user.pnid,
                        user_id: user._id
                    },
                    was_solved, was_violated, violation_image, not_violated_reason
                });

                if(was_solved && complaint.is_following) {
                    await SmsRepository.sendMessage({
                        message: `Your complaint has been solved. Thank you.`,
                        to: updatedComplaint.phone_number
                    })
                }
                return resolve(updatedComplaint)
            })
        )
    }

    static async getAllDriverAcceptedComplaints(driver_id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const complaints = await Complaint.find({ 
                    'accepted_by.user_id': driver_id,
                    status: 'accepted'
                })
                return resolve(complaints)
            })
        )
    }

    static async getAllDriverCompletedComplaints(driver_id){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const complaints = await Complaint.find({ 
                    status: 'completed',
                    'completed_by.user_id': driver_id
                })
                return resolve(complaints)
            })
        )
    }

    static async getTotalComplaints(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const count = await Complaint.countDocuments()
                return resolve(count)
            })
        )
    }

    static async getTotalCompletedComplaints(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const count = await Complaint.countDocuments({ status: 'completed' })
                return resolve(count)
            })
        )
    }

    static async getTotalComplaintsCompleteTime(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const result = await Complaint.aggregate([
                    {
                        $group: {
                            _id: null,
                            total_complete_time: {
                                $sum: '$total_complete_time'
                            }
                        }
                    }
                ])

                const count = Math.floor(result[0].total_complete_time / 60)
                return resolve(count)
            })
        )
    }

    static async getAverageComplaintsCompleteTime(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const result = await Complaint.aggregate([
                    {
                        $group: {
                            _id: null,
                            average_complete_time: {
                                $avg: '$total_complete_time'
                            }
                        }
                    }
                ])
                const count = Math.floor(result[0].average_complete_time / 60)

                return resolve(count)
            })
        )
    }


    static async getGroupedComplaintsGraphData(){
        return new Promise(
            promiseAsyncWrapepr(async (resolve, reject) => {
                const result = await Complaint.aggregate([
                    {
                        $group: {
                            _id: { $substr: [ "$created_at", 0, 10 ] },
                            count: { $sum: 1 }
                        }
                    }
                ])

                const formattedResult = result.map(e => {
                    return {
                        x: e._id,
                        y: e.count
                    }
                })
                return resolve(formattedResult)
            })
        )
    }

}

export default ComplaintRepository