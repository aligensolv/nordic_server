import moment from "moment"
import { base_url, compiled_driver_report_template, manager_email, manager_phone_number } from "../config.js"
import { BAD_REQUEST } from "../constants/status_codes.js"
import CustomError from "../interfaces/custom_error_class.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import Auth from "./Auth.js"
import CarRepository from "./Car.js"
import EmailRepository from "./Email.js"
import SmsRepository from "./Sms.js"
import UserRepository from "./User.js"
import puppeteer from "puppeteer"
import PdfRepository from "./Pdf.js"
import ArchieveRepository from "./Archieve.js"
import ViolationRepository from "./Violation.js"
import AccidentRepository from "./Accident.js"
import { readFileSync } from "fs"
import path from "path"
import {sendAlertMail} from '../utils/smtp_service.js'
import Randomstring from 'randomstring'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DriverReportRepository{
    static async sendCarOverLimitEmail({ information, user }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const existingCar = await CarRepository.getCarById(information.carId)

                let emailData = readFileSync(path.join(__dirname,'../data/email.json'),{ 
                    encoding: 'utf8',
                    flag: 'r'
                })

                let emailJson = JSON.parse(emailData)
                let emailSubject = emailJson.subject
                .replace(/{private}/g, information.privateNumber)
                .replace(/{board}/g, information.boardNumber)
                .replace(/{pnid}/g, user.pnid)
                .replace(/{kilometers}/g, existingCar.kilometers);
    
                let emailText = emailJson.text
                .replace(/{private}/g, information.privateNumber)
                .replace(/{board}/g, information.boardNumber)
                .replace(/{pnid}/g, user.pnid)
                .replace(/{kilometers}/g, existingCar.kilometers);

                sendAlertMail({
                    // to:'me@mutaz.no',
                    to: manager_email,
                    // to:"alitarek99944@gmail.com",
                    subject: emailSubject,
                    text: emailText,
                    html: `<h2>${emailText}</h2>`                    
                })

                await EmailRepository.storeEmail({
                    to: manager_email,
                    subject: emailSubject,
                    content: emailText,
                    html: `<h2>${emailText}</h2>`,
                    text: emailText
                })
                return resolve(true)
            })
        )
    }

    static async sendCarOverLimitSms({ information, user }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const existingCar = await CarRepository.getCarById(information.carId)

                let smsData = readFileSync(path.join(__dirname,'../data/sms.json'),{ 
                    encoding: 'utf8',
                    flag: 'r'
                })
                
                let smsJson = JSON.parse(smsData)
                let smsText = smsJson.text
                .replace(/{private}/g, information.privateNumber)
                .replace(/{board}/g, information.boardNumber)
                .replace(/{pnid}/g, user.pnid)
                .replace(/{kilometers}/g, existingCar.kilometers);
    
    
                await SmsRepository.sendMessage({
                    message: smsText,
                    to: manager_phone_number
                    // to:'4740088605'
                });

                await SmsRepository.storeSms({
                    delivered_to: manager_phone_number,
                    content: smsText,
                    total_received: 1,
                    about: 'exceeded car kilometers',
                })

                return resolve(true)
            })
        )
    }

    static async updateDriverCarUsage({ information, user }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                
                let existingCar = await CarRepository.getCarById(information.carId)
                if(+information.kilometers + +existingCar.currentKilometers <= +existingCar.kilometers){
                    
                    await CarRepository.updateCar({
                        car_id: information.carId,
                        currentKilometers: existingCar.currentKilometers + information.kilometers
                    })

                }else{
                    if(existingCar.currentKilometers != 0){
                        await this.sendCarOverLimitEmail({ information, user })
                        await this.sendCarOverLimitSms({ information, user })
                    }

                    await CarRepository.updateCar({
                        car_id: information.carId,
                        currentKilometers: 0,
                    })

                }


                return resolve(true)
            })
        )
    }

    static async createReportTemplate({ information, user,groupedData, groupedImages  }) {
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const browser = await puppeteer.launch({
                    headless: 'new',
                    args:['--no-sandbox']
                });
                const page = await browser.newPage();

                const template_data = {
                    location: information.locations,
                    car: information.boardNumber + "  " + information.privateNumber,
                    shift: information.day + " - " + information.period,
                    violations: information.trafficViolations,
                    date: information.date,
                    user: user.name + ' - ' + user.pnid,
                    rows: [...groupedData['First'],...groupedData['Second']].map(e => {
                        return {
                            title: e.title,
                            status: e.value != 'Ja' && e.value != 'Nei' ? (e.whenToGetDescription ? 'Ja' : 'Nei') : e.value,
                            notes: e.value != 'Ja' && e.value != 'Nei' ? e.value : 'XXX',
                            positive: e.value != 'Ja' && e.value != 'Nei' ? 'red' : 'green'
                        };
                    }),
                    groupedImages:groupedImages,
                };

                const filledTemplate = compiled_driver_report_template(template_data)
                console.log(filledTemplate);
                let filename = `Betjent_${user.pnid}_${Randomstring.generate(10)}.pdf`

                // Generate PDF from filled template
                await page.setContent(filledTemplate);
                await page.pdf({ 
                    path: `./public/profiles/${filename}`, 
                    printBackground: true, 
                    format: 'A3' 
                });

                await browser.close();
                return resolve(filename)
            })
        )
    }

    static async checkForAccident(grouped_data){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let filteredWanted = grouped_data['First'].filter(e => {
                    return e.title.includes('Lakk/bulker/merker')
                })

                if(filteredWanted.length == 0) return resolve(false)

                if((filteredWanted[0].value != 'Ja' && filteredWanted[0].value != 'Nei') && information.carId != undefined){
                    let existingCar = await CarRepository.getCarById(information.carId)
                    await AccidentRepository.createAccident({
                        username:user.name,
                        pnid:user.pnid,
                        boardNumber: existingCar.boardNumber,
                        privateNumber: existingCar.privateNumber,
                        content:filteredWanted[0].value
                    })        
                }
                
                return resolve(true)
            })
        )
    }

    static async createDriverReport ({ token, information, groupedData, groupedImages }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const decoded = await Auth.verifyToken(token)
                const user = await UserRepository.getUserById(decoded.id)

                if(!information.carId){
                    let not_found_error = new CustomError('Car id is required', BAD_REQUEST)
                    return reject(not_found_error)
                }

                await this.updateDriverCarUsage({ information, user })
                const filename = await this.createReportTemplate({ information, user, groupedData, groupedImages })

                const pdf = await PdfRepository.storePdf({
                    filename: filename,
                    user_id: user._id
                })

                await ArchieveRepository.storeArchieve({ pdf, user })
                await ViolationRepository.storeViolation({ user, information })
                await this.checkForAccident(groupedData)

                return resolve(true)
            })
        )
    }

    
}

export default DriverReportRepository