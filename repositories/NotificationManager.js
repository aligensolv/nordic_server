import { firebase_notification_topic } from '../config.js'
import promiseAsyncWrapper from '../middlewares/promise_async_wrapper.js';
import Admin from '../utils/firebase.js'
import ValidatorRepository from './Validator.js';

class NotificationManager{
    static async sendNotificaitonToAllUsers({ title, body }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await ValidatorRepository.validateNotNull({ title, body })

                const message = {
                    data: { title, body, type: 'users' },
                    topic: firebase_notification_topic, 
                };
                
                await Admin.messaging().send(message)
                return resolve(true)
            })
        )
    }

    static async sendNotificationToZones({ title, body, imeis }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const message = {
                    data: { title, body, type: 'zone', imeis: JSON.stringify(imeis) },
                    topic: firebase_notification_topic,
                };
                
                await Admin.messaging().send(message)
                return resolve(true)
            })
        )
    }

    static async sendNotificationToCertainDevices({ title, body, imeis }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const message = {
                    data: { title, body, type: 'device', imeis: JSON.stringify(imeis) },
                    topic: firebase_notification_topic, // Replace with the topic you want to use
                };
                
                await Admin.messaging().send(message)
                return resolve(true)
            })
        )
    }
}

export default NotificationManager