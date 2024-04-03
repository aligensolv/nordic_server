import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.join(__dirname, './.env')
})

import { readFileSync } from 'fs'
import Handlebars from 'handlebars'



export const jwt_secret_key = process.env.JWT_SECRET_KEY.trim()
export const port = process.env.PORT.trim()
export const socket_port = process.env.SOCKET_PORT.trim()
export const host = process.env.HOST.trim()
export const node_env = process.env.NODE_ENV.trim()
export const is_development = node_env == 'development'
export const base_url = process.env.BASE_URL

export const database_connection_string = process.env.DATABASE_CONNECTION_STRING
export const static_files_host = process.env.STATIC_FILES_HOST
export const static_absolute_files_host = process.env.ABSOLUTE_STATIC_FILES_HOST

export const manager_phone_number = process.env.MANAGER_PHONE_NUMBER
export const owner_phone_number = process.env.OWNER_PHONE_NUMBER
export const second_manager_phone_number = process.env.SECOND_MANAGER_PHONE_NUMBER
export const manager_email = process.env.MANAGER_EMAIL

export const drivers_phone_numbers = process.env.DRIVERS_PHONE_NUMBERS.split(',')

export const smtp_host = process.env.SMTP_HOST
export const smtp_port = +process.env.SMTP_PORT
export const smtp_user = process.env.SMTP_USER
export const smtp_pass = process.env.SMTP_PASS

export const nexmo_api_url = process.env.NEXMO_API_URL
export const nexmo_api_key = process.env.NEXMO_API_KEY
export const nexmo_api_secret = process.env.NEXMO_API_SECRET
export const nexmo_from_name = process.env.NEXMO_FROM_NAME

export const vps_host = process.env.VPS_HOST
export const vps_port = +process.env.VPS_PORT
export const vps_user = process.env.VPS_USER
export const vps_pass = process.env.VPS_PASS

export const firebase_notification_topic = process.env.FIREBASE_NOTIFICATION_TOPIC

export const nordic_client_ticket_host = process.env.NORDIC_CLIENT_TICKET_HOST
export const nordic_complaint_client_host = process.env.NORDIC_COMPLAINT_CLIENT_HOST


export const driver_report_template = readFileSync('templates/driver.html', 'utf8')
export const compiled_driver_report_template = Handlebars.compile(driver_report_template)
