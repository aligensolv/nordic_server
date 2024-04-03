import moment from "moment"
import NotificationModel from "../models/NotificationModel.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import IssueNotificationModel from "../models/IssueNotification.js"

class NotificaitonRepository{
    static storeNotification({ title, body, zones, imeis }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')

                await NotificationModel.create({
                    title, body, zones, imeis, created_at
                })

                return resolve(true)
            })
        )
    }

    static async getAllNotifications(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const notifications = await NotificationModel.find({})
                return resolve(notifications)
            })
        )
    }

    static async getNotificationsByImeis(imei){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const notifications = await NotificationModel.find({
                    imeis:{
                      $in: [imei,'*']
                    }
                })

                return resolve(notifications)
            })
        )
    }

    static async getNotificationsByZone(zone){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const notifications = await NotificationModel.find({
                    zones:{
                      $in: [zone]
                    }
                  })

                return resolve(notifications)
            })
        )
    }

    static async getIssueNotifications(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const notifications = await IssueNotificationModel.find({}).sort({ created_at: -1 })
                return resolve(notifications)
            })
        )
    }
}

export default NotificaitonRepository
