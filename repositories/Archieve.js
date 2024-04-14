import moment from "moment"
import PdfArchieve from "../models/PdfArchieve.js"
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"

class ArchieveRepository{
    static async storeArchieve({ pdf, user }){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const created_at = moment().format('YYYY-MM-DD')

                let archieve = await PdfArchieve.create({
                    name: pdf.name,
                    link: pdf.link,
                    username: user.name,
                    pnid: user.pnid,
                    created_at,
                })


                return resolve(archieve)
            })
        )
    }
    
    static async getAllArchives(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const archives = await PdfArchieve.find({}).sort({ created_at: -1 })
                return resolve(archives)
            })
        )
    }

    static async getArchiveById(id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const archive = await PdfArchieve.findById(id)
                return resolve(archive)
            })
        )
    }
}

export default ArchieveRepository