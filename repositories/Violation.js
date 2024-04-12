import moment from "moment"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import Violation from "../models/Violation.js"

class ViolationRepository{

    static async storeViolation({ user, information }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const current_date = moment().format('YYYY-MM-DD')
                const current_time = moment().format('HH:mm:ss')

                const violation = await Violation.create({
                    username:user.name,
                    accountId:user.pnid,
                    violations:eval(information.trafficViolations),
                    removed:Number.isNaN(+information.trafficViolations.split('-')[1]) ? 0 : +information.trafficViolations.split('-')[1],
                    createdAt:current_date,
                    time:current_time
                })
                await violation.save()
                return resolve(violation)
            })
        )
    }

    static async deleteViolationByPnid(pnid){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await Violation.deleteOne({
                    accountId: pnid,
                })

                return resolve(true)
            })
        )
    }

    static async deleteViolationById(violation_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await Violation.deleteOne({
                    _id: violation_id
                })
                return resolve(true)
            })
        )
    }

    static async deleteAllViolations(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await Violation.deleteMany({});
                return resolve(true)
            })
        )
    }

    static async getViolationById(violation_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const violation = await Violation.findOne({
                    _id: violation_id
                })
                return resolve(violation)
            })
        )
    }

    static async getUserViolations(user_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const violations = await Violation.find({
                    accountId: user_id
                })
                return resolve(violations)
            })
        )
    }

    static async getTotalViolationsCount(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const count = await Violation.countDocuments({})
                return resolve(count)
            })
        )
    }

    static async getTotalRemovedViolationsCount(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const violations = await Violation.aggregate([
                    { $group: { _id: null, total: { $sum: "$removed" } } }
                ])
                return resolve(violations[0]?.total || 0)
            })
        )
    }
}

export default ViolationRepository