import moment from "moment";
import Issue from "../models/Issue.js";
import MachineRepository from "./Machine.js";
import SMS from "../models/SMS.js";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import CustomError from "../interfaces/custom_error_class.js";
import { NOT_FOUND } from "../constants/status_codes.js";
import SmsRepository from "./Sms.js";

class IssueRepository{

    static async getAllIssues(status){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                if(status){
                    const issues = await Issue.find({status});
                    return resolve(issues)
                }
                
                const issues = await Issue.find({});
                return resolve(issues)
            })
        )
    }

    static async getAllTotalIssues(status){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                if(status){
                    const count = await Issue.countDocuments({status});
                    return resolve(count)
                }
                
                const count = await Issue.countDocuments({});
                return resolve(count)
            })
        )
    }

    static async getAllVerifiedIssues(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let issues = await Issue.find({
                    $or:[
                        { status: 'redirected' },
                        {
                            $and: [
                                { publisher: 'driver' },
                                {
                                    status: 'incomplete'
                                },
                            ]
                        }
                    ]
                })
                return resolve(issues)
            })
        )
    }

    static async getIssueById(issue_id){
        return new Promise(async (resolve) => {
            const issue = await Issue.findById(issue_id)

            return resolve(issue)
        })
    }
    
    static async updateIssue({ issue_id, status, processes, statusText, waitingStartTime, wasInWaitingState }){
        return new Promise(async (resolve, reject) => {
            const result = await Issue.updateOne({_id: issue_id},{
                status, processes, statusText, waitingStartTime, wasInWaitingState
            })
            resolve(true)
        })
    }

    static setIssueInWaitingState({ issue_id, reason }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                const issue = await this.getIssueById(issue_id)

                if(!issue){
                    let issue_not_found_error = new CustomError(`Issue '${issue_id}' does not exist`, NOT_FOUND)
                    return reject(issue_not_found_error)
                }

                const current_date = moment().format('DD.MM.YYYY HH:mm:ss')

                let processes = issue.processes
                processes.push(`Issue is in waiting state at ${current_date}`)


                await this.updateIssue({
                    issue_id,
                    status: 'waiting',
                    processes: processes,
                    statusText: reason,
                    waitingStartTime: current_date,
                    wasInWaitingState: true
                })

                await MachineRepository.setMachineInWaitingState({ machine_id: issue.machine })

                return resolve(true)
            })
        )
    }

    static async deleteAllIssues(){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const issues = await Issue.deleteMany({});
                return resolve(issues)
            })
        )
    }


    static async deleteIssueById(issue_id){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                const issue = await Issue.deleteOne({
                    _id: issue_id
                });
                return resolve(issue)
            })
        )
    }

    static async notifyClientAboutIssue({ phone, current_date, machine_location}){
        return new Promise(
            promiseAsyncWrapper(async (resolve) => {
                let smsMessageFormatted = 
                `
                Hei, 
                Vi har mottatt din klager på ${machine_location} og vi snart der for å fikse saken.
                
                Takk for beskjed.
                `

                await SmsRepository.sendMessage({
                    message: smsMessageFormatted,
                    to: phone.toString()
                })

                await SmsRepository.storeSms({
                    delivered_to: [phone.toString()],
                    total_received: 1,
                    sender: 'System',
                    content: smsMessageFormatted,
                    about: 'notify client that issue was received',
                })

                return resolve(true)
            })
        )
    }

    static async notifyManagersAboutIssue({ machine, publisher, pnid, boardNumber, problem, importanceLevel }) {
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                // const importantPhones = importanceLevel === 1 ? ['4747931499', '4747931499', '4740088605'] : ['4740088605', '4747931499'];
                const importantPhones = importanceLevel === 1 ? 
                ['201150421159', '201150421159', '201150421159'] : ['201150421159', '201150421159'];

                await SmsRepository.sendMessage({
                    message: `Automat som ligger i adressen ${machine.zoneLocation} er ${problem}  klagen har kommet fra ${publisher == 'driver' ? 'pnid ' + pnid : publisher == 'admin' ? 'Drift' : 'skilt nr ' + boardNumber}`,
                    to: importantPhones,
                });


                await SmsRepository.storeSms({
                    delivered_to: importantPhones,
                    total_received: importantPhones.length,
                    sender: 'System',
                    content: `Automat som ligger i adressen ${machine.zoneLocation} er ${problem},  klagen har kommet fra ${publisher == 'driver' ? 'pnid ' + pnid : publisher == 'admin' ? 'Drift' : 'skilt nr ' + boardNumber}`,
                    about: importanceLevel === 1 ? 'notify about high importance issue' : 'notify about low or medium importance issue',
                });

                return resolve(true)
            }
        ))
    }

    static async createIssue({ machine_id,publisher,pnid,notes,category,boardNumber, problem,importanceLevel, phone }){
        return new Promise(
            promiseAsyncWrapper(async (resolve, reject) => {
                let machine = await MachineRepository.getMachineById(machine_id)
                let current_date = moment().format('DD.MM.YYYY HH:mm:ss')

                const issue = new Issue({
                    title: `Feil på Automat ${machine.zoneLocation}`,
                    description: `Automat som ligger i adressen ${machine.zoneLocation}  er ${problem},  klagen har kommet fra ${publisher == 'driver' ? 'pnid ' + pnid : publisher == 'admin' ? 'Drift' : 'skilt nr ' + boardNumber}`,
                    notes: notes ?? null,
                    created_at: current_date,
                    machine: machine_id ,
                    serial: machine.serial,
                    zone: machine.zone.name,
                    zoneLocation: machine.zoneLocation,
                    boardNumber: boardNumber,
                    processes:[
                        `${publisher} uploaded issue at ${current_date}`,
                    ],
                    category: category,
                    problem: problem,
                    importanceLevel: importanceLevel,
                    publisher: publisher,
                    publisher_identifier: publisher == 'driver' ? pnid : publisher == 'admin' ? 'Drift' : boardNumber
                })

                if(publisher == 'driver'){
                    issue.wasRedirected = true
                    issue.redirectStartTime = moment(current_date).format('DD.MM.YYYY HH:mm:ss')
                }    

                await issue.save()

                if(publisher == 'client' && phone != undefined && phone != ""){
                    await this.notifyClientAboutIssue({
                        phone,
                        current_date,
                        machine_location: machine.zoneLocation
                    })
                }

                await this.notifyManagersAboutIssue({ machine, publisher, pnid, boardNumber, problem, importanceLevel })
                await MachineRepository.setMachineInInactiveState({ machine_id: issue.machine })

                return resolve(true)
            })
        )
    }

    static async getIssuesDataGroupedByImportanceLevel(){
        return new Promise(
            async (resolve, reject) => {
                const result = await Issue.aggregate([
                    { $group: {
                        _id: '$importanceLevel',
                        count: { $sum: 1 },
                        issues: { $push: '$$ROOT' }
                    }},
                    { $sort: { _id: 1 } }
                ])

                return resolve(result)
            }
        )
    }


    static async getIssuesDataGroupedByMonth(startDate, endDate){
        return new Promise(
            async (resolve, reject) => {
                try {
                    let result = await Issue.aggregate([
                        { $project: {
                            month: { $dateToString: { format: "%m.%Y", date: { $toDate: "$created_at" } } }
                        }},
                        { $group: {
                            _id: '$month',
                            count: { $sum: 1 },
                            issues: { $push: '$$ROOT' }
                        }},
                        { $sort: { _id: 1 } }
                    ]);

                    if(startDate !== undefined && endDate !== undefined) {
                        let start = moment(startDate, 'DD.MM.YYYY')
                        let end = moment(endDate, 'DD.MM.YYYY')
                        
                        result = result.filter(r => {
                            let date = moment(r._id, 'MM.YYYY')
                            return date.isSameOrAfter(start) && date.isSameOrBefore(end)
                        })
                    }
    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
        );
    }

    static async getIssuesDataGroupedByDay(startDate, endDate){
        return new Promise(
            async (resolve, reject) => {
                try {
                    let result = await Issue.aggregate([
                        { $group: {
                            _id: { $dateToString: { format: "%d.%m.%Y", date: { $toDate: "$created_at" } } },
                            count: { $sum: 1 },
                            issues: { $push: '$$ROOT' }
                        }},
                        { $sort: { _id: 1 } }
                    ]);


                    if(startDate !== undefined && endDate !== undefined) {
                        let start = moment(startDate, 'DD.MM.YYYY')
                        let end = moment(endDate, 'DD.MM.YYYY')
                        
                        result = result.filter(r => {
                            let date = moment(r._id, 'DD.MM.YYYY')
                            return date.isSameOrAfter(start) && date.isSameOrBefore(end)
                        })
                    }
    
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
        );
    }

    static async getDaysGroupedIssuesIntoAverages(){
        return new Promise(
            promiseAsyncWrapper(
                async (resolve, reject) => {
                    const grouped_date_issues = await Issue.aggregate([
                        { $group: {
                            _id: { $dateToString: { format: "%d.%m.%Y", date: { $toDate: "$created_at" } } },
                            count: { $sum: 1 },
                            issues: { $push: '$$ROOT' }
                        }},
                        { $sort: { _id: 1 } }
                    ]);

                    const result = grouped_date_issues.map(item => {
                        
                        const sum = item.issues.reduce((sum, issue) => {
                            let end = moment(issue.fixedAt)
                            let start = moment(issue.created_at)
                            let diff = moment.duration(end.diff(start))

                            return sum + diff.asHours()
                        }, 0)

                        const avg = sum / item.count

                        return {
                            date: item._id,
                            count: item.count,
                            average: avg.toFixed(2),
                        }
                    })
                    resolve(result);
                }
            )
        );
            
    }
    
    
    static async getCompletedIssuesGroupedByIdentifier(startDate, endDate){
        return new Promise(
            async (resolve, reject) => {
                try {
                    let result = await Issue.aggregate([
                        { $match: { status: 'complete' } },
                        { $group: {
                            _id: '$fixedByIdentifier',
                            count: { $sum: 1 },
                            issues: { $push: '$$ROOT' }
                        }},
                        { $sort: { _id: 1 } }
                    ]);


                    if(startDate != undefined && endDate != undefined){
                        result = result.map(r => {
                            let start = moment(startDate, 'DD.MM.YYYY')
                            let end = moment(endDate, 'DD.MM.YYYY')
                            
                            r.issues = r.issues.filter(i => {
                                let current_date = moment(i.fixedAt, 'DD.MM.YYYY HH:mm:ss')
                                return current_date.isSameOrAfter(start) && current_date.isSameOrBefore(end)
                            })

                            return r
                        })          
                        
                    }

                    const final_result = this.mapGroupedCompletedIssuesByIdentifierToValues(result)
    
                    resolve(final_result);
                } catch (error) {
                    reject(error);
                }
            }
        );
    }

    static mapGroupedCompletedIssuesByIdentifierToValues(grouped_items){
        let mapped = grouped_items.map(r => {
            return {
                identifier: r._id,
                count: r.count,
                value: r.issues.reduce((sum, item) => {
                    let end = moment(item.fixedAt, 'DD.MM.YYYY HH:mm:ss')
                    let start = moment(item.created_at, 'DD.MM.YYYY HH:mm:ss')
                    let diff = moment.duration(end.diff(start))
                    return sum + diff.asHours()
                }, 0)
            }
        })

        return mapped.filter(r => r.value != 0)
    }


    static async getTotalIssueSolveHoursAverage(){
        return new Promise(
            promiseAsyncWrapper(
                async (resolve, reject) => {
                    const completed_issues = await this.getAllIssues('complete')

                    let issueSolvedHours = completed_issues.map(ic => {
                        let end = moment(ic.fixedAt)
                        let start = moment(ic.created_at)
                    
                        let diff = moment.duration(end.diff(start))
                        return diff.asHours()
                    })

                    issueSolvedHours = issueSolvedHours.filter(Boolean)
                    let issueSolvedHoursSum = issueSolvedHours.reduce((sum, hour) => sum + hour,0)

                    let issueSolvedHoursAverage = (issueSolvedHoursSum / issueSolvedHours.length).toFixed(2)
                    let fraction = issueSolvedHoursAverage.split('.')
                    fraction[0] = fraction[0] + 'H'
                    fraction[1] = issueSolvedHours.length > 0 ? ((+fraction[1] / 100) * 60).toFixed(0) + 'M' : '0M'
                    issueSolvedHoursAverage = issueSolvedHours.length > 0 ? fraction.join(' ') : 0


                    resolve(issueSolvedHoursAverage)
                }
            )
        )
    }

    static async getTotalRedirectAverageTime(){
        return new Promise(
            promiseAsyncWrapper(
                async (resolve, reject) => {
                    let issueWereRedirected = await Issue.find({
                        wasRedirected: true,
                        $nor:[{
                          redirectStartTime: null
                        }]
                      })

                    let issueRedirectHours = issueWereRedirected.map(iwr =>{
                        let end = moment(iwr.fixedAt)
                        let start = moment(iwr.redirectStartTime)
                      
                        let diff = moment.duration(end.diff(start))
                        return diff.asHours()
                      })
                      
                      issueRedirectHours = issueRedirectHours.filter(Boolean)
                      let issueRedirectHoursSum = issueRedirectHours.reduce((sum, hour) => sum + hour, 0)
                      let issueRedirectHoursAverage = issueRedirectHours.length > 0 ?
                      (issueRedirectHoursSum / issueRedirectHours.length).toFixed(2) : 0
                        
                      let idhaParts = issueRedirectHoursAverage.toString().split('.')
                      idhaParts[0] = idhaParts[0] + 'H'
                      idhaParts[1]  = issueRedirectHours.length > 0 ?  ((+idhaParts[1] / 100) * 60).toFixed(0) + 'M' : 0 + 'M'
                      
                      idhaParts = idhaParts.join(' ')
                      issueRedirectHoursAverage = idhaParts


                    resolve(issueRedirectHoursAverage)
                }
            )
        )
    }

    static getTotalIssueWaitingAverageTime(){
        return new Promise(
            async (resolve, reject) => {
                let issuesWereInWaitingState = await Issue.find({
                    wasInWaitingState: true,
                    $nor:[{
                      waitingStartTime: null
                    },{ WaitingEndTime: null }]
                  })

                let issueWaitingHours = issuesWereInWaitingState.map(iws => {
                    let end = moment(iws.WaitingEndTime)
                    let start = moment(iws.waitingStartTime)
                
                    let diff = moment.duration(end.diff(start))
                    return diff.asHours()
                  })
                
                  issueWaitingHours = issueWaitingHours.filter(Boolean)
                  let issueSolvedWaitingHoursSum = issueWaitingHours.reduce((sum, hour) => sum + hour,0)
                  let issueSolvedWaitingHoursAverage = issueWaitingHours.length > 0 ? 
                    (issueSolvedWaitingHoursSum / issueWaitingHours.length).toFixed(2) : 0
                
                    let iswha = issueSolvedWaitingHoursAverage.toString().split('.')
                    iswha[0] = iswha[0] + 'H'
                    iswha[1]  = issueWaitingHours.length > 0 ?  ((+iswha[1] / 100) * 60).toFixed(0) + 'M' : 0 + 'M'
                  
                    iswha = iswha.join(' ')
                    issueSolvedWaitingHoursAverage = iswha


                resolve(issueSolvedWaitingHoursAverage)
            }
        )
    }
}

export default IssueRepository