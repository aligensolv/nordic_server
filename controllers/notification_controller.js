import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ImeiRepository from "../repositories/Imei.js";
import NotificaitonRepository from "../repositories/Notification.js";
import NotificationManager from "../repositories/NotificationManager.js";

export const sendNotificaitonToAllUsers = asyncWrapper(
    async (req, res) => {
        const { title, body } = req.body
        await NotificationManager.sendNotificaitonToAllUsers({ 
            title, body
        })

        await NotificaitonRepository.storeNotification({
            title, body
        })

        return res.sendStatus(OK)
    }
)

export const sendNotificationToCertainDevices = asyncWrapper(
    async (req, res) => {
        const { title, body, imeis } = req.body

        await NotificationManager.sendNotificationToCertainDevices({ 
            title, body, imeis
        })

        await NotificaitonRepository.storeNotification({
            title, body,imeis
        })

        return res.sendStatus(OK)
    }
)

export const sendNotificationToZones = asyncWrapper(
    async (req, res) => {
        const { title, body, zones } = req.body
        let imeis = await ImeiRepository.getImeisSerialsByZones(zones)

        await NotificationManager.sendNotificationToZones({ 
            title, body, imeis
        })

        await NotificaitonRepository.storeNotification({
            title, body, zones, imeis
        })
        return res.sendStatus(OK)
    }
)

export const getAllNotifications = asyncWrapper(
    async (req, res) => {
        const notifications = await NotificaitonRepository.getAllNotifications()
        return res.status(OK).json(notifications)
    }
)

export const getNotificationsByImeis = asyncWrapper(
    async (req, res) => {
        const { imei } = req.params
        const notifications = await NotificaitonRepository.getNotificationsByImeis(imei)
        return res.status(OK).json(notifications)
    }
)

export const getNotificationsByZone = asyncWrapper(
    async (req, res) => {
        const { zone } = req.params
        const notifications = await NotificaitonRepository.getNotificationsByZone(zone)
        return res.status(OK).json(notifications)
    }
)

export const getIssueNotifications = asyncWrapper(
    async (req, res) => {
        const notifications = await NotificaitonRepository.getIssueNotifications()
        return res.status(OK).json(notifications)
    }
)