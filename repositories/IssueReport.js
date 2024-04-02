import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import IssueReport from "../models/IssueReport.js"

class IssueReportRepository{
    static async getAllReports(limit){
        return new Promise(
            promiseAsyncWrapper(
                async (resolve) => {
                    if(limit){
                        const reports = await IssueReport.find({}).limit(limit)
                        return resolve(reports)
                    }

                    const reports = await IssueReport.find({})
                    return resolve(reports)
                }
            )
        )
    }

    static async createIssueReport(){

    }
}

export default IssueReportRepository