import moment from "moment"
import Pdf from "../models/PDF.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import ViolationRepository from "./Violation.js"
import CustomError from "../interfaces/custom_error_class.js"
import { NOT_FOUND } from "../constants/status_codes.js"
import { static_absolute_files_host } from "../config.js"

class PdfRepository{
    static async storePdf({ filename, user_id }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('YYYY-MM-DD')
                const creation_time = moment().format('HH:mm:ss')

                let pdf = await Pdf.create({
                    name: filename,
                    link: static_absolute_files_host + 'profiles/' + filename,
                    createdAt: created_at,
                    time: creation_time,
                    userId: user_id
                })

                return resolve(pdf)
            })
        )
    }

    static async deletePdf(pdf_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let pdf = await Pdf.findById(pdf_id).populate({
                    path:'userId',
                    ref:'User'
                })

                if(!pdf){
                    let pdf_not_found_error = new CustomError('PDF not found', NOT_FOUND)
                    return reject(pdf_not_found_error)
                }

                await Pdf.deleteOne({
                    _id: pdf_id
                });

                await ViolationRepository.deleteViolationByPnid(pdf.userId.pnid)

                return resolve(true)
            })
        )
    }

    static async deleteAllPdfs(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                await Pdf.deleteMany({});
                return resolve(true)
            })
        )
    }

    static async getPdfById(pdf_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let pdf = await Pdf.findOne({ _id: pdf_id }).populate({
                    path:'userId',
                    ref:'User'
                })
                return resolve(pdf)
            })
        )
    }

    static async getAllPdfs(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let pdfs = await Pdf.find({})
                .populate({
                    path:'userId',
                    ref:'User'
                })
                
                return resolve(pdfs)
            })
        )
    }
}

export default PdfRepository