import moment from "moment"
import IssueNotification from "../models/IssueNotification.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"

class IssueNotificationRepository{

    static async getAllIssueNotifications(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const notifications = await IssueNotification.find({})
                return resolve(notifications)
            })
        )
    }

    static async storeIssueNotification({ title, body, notification_type }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('DD.MM.YYYY HH:mm:ss')
                const notification = await IssueNotification.create({
                    title, body, created_at, notification_type
                })
                return resolve(notification)
            })
        )
    }
}

export default IssueNotificationRepository