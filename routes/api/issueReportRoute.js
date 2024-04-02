import { Router } from 'express';
const router = Router()
import Machine from '../../models/Machine.js';
import Issue from '../../models/Issue.js';
import SMS from '../../models/SMS.js';
import moment from 'moment';


router.get('/reports/general/:id', async (req, res) => {
const { id } = req.params

try{
  let issues = await Issue.find()
  let waitingIssues = await Issue.find({
    status: 'waiting'
  })

  let completedIssues = await Issue.find({
    status: 'complete'
  })

  let inCompletedIssues = await Issue.find({
    status: 'incomplete'
  })

  let issuePublishedByDriver = await Issue.find({
    publisher: 'driver'
  })

  let issueSolvedByDriver = await Issue.find({
    fixedBy: 'driver'
  })

  let machines = await Machine.find()
  
  if(id == 0){
    let currentMonth = moment().month()
    completedIssues = completedIssues.filter(issue =>{
        return moment(issue.fixedAt).month() == currentMonth
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'),'month')
    })

    console.log(inCompletedIssues.length);
    issues = issues.filter(issue =>{
      return moment(issue.date).month() == currentMonth
    })


    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(issue.date).month() == currentMonth
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(issue.fixedAt).month() == currentMonth
    })
  }else if(id == 1){
    let currentDay = moment(moment.now()).day()
    let currentMonth = moment(moment.now()).month()
    completedIssues = completedIssues.filter(issue =>{
      return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    issues = issues.filter(issue =>{
      return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    waitingIssues = waitingIssues.filter(issue =>{
      return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(issue.date).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(issue.fixedAt).day() == currentDay && moment(issue.fixedAt).month() == currentMonth
    })
  }else if(id == 2){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let twoDaysAgo = moment(moment().subtract(2,'days').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    issues = issues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    waitingIssues = waitingIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(twoDaysAgo,currentDate,'days','[]')
    })
  }else if(id == 3){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let oneWeekAgo = moment(moment().subtract(1,'weeks').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    issues = issues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    waitingIssues = waitingIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneWeekAgo,currentDate,'days','[]')
    })
  }else if(id == 4){
    let currentDate = moment(moment().format('YYYY-MM-DD'))
    let oneMonthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    issues = issues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    waitingIssues = waitingIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(oneMonthAgo,currentDate,'days','[]')
    })
  }else if(id == 5){
    const lowerBoundDate = req.headers.lowerbound
    const upperBoundDate = req.headers.upperbound
    if(!lowerBoundDate || !upperBoundDate){
      return res.status(400).json({
        message: 'Bad Request Lower Bound or Upper Bound Date is required',
        lowerBoundDate
      }) 
    }

    let start = moment(moment(lowerBoundDate).format('YYYY-MM-DD'))
    let end = moment(moment(upperBoundDate).format('YYYY-MM-DD'))

    completedIssues = completedIssues.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    issues = issues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    inCompletedIssues = inCompletedIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    waitingIssues = waitingIssues.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    issuePublishedByDriver = issuePublishedByDriver.filter(issue =>{
      return moment(moment(issue.date).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })

    issueSolvedByDriver = issueSolvedByDriver.filter(issue =>{
      return moment(moment(issue.fixedAt).format('YYYY-MM-DD')).isBetween(start,end,'days','[]')
    })
  }

  let totalActive = machines.reduce((sum,machine) => sum + machine.totalWorkingTime,0).toFixed(0)
  let totalOffline = machines.reduce((sum,machine) => sum + machine.totalOfflineTime,0).toFixed(0)

  if(totalActive < 1){
    totalActive = totalActive + 'M'
  }else{
    totalActive = totalActive + 'H'
  }

  if(totalOffline < 1){
    totalOffline = totalOffline + 'M'
  }else{
    totalOffline = totalOffline + 'H'
  }
  return res.status(200).json({
    totalIssues: issues.length,
    waitingIssues: waitingIssues.length,
    completedIssues: completedIssues.length,
    inCompletedIssues: inCompletedIssues.length,
    issuePublishedByDriver: issuePublishedByDriver.length,
    issueSolvedByDriver: issueSolvedByDriver.length,
    totalActive,
    totalOffline
  })

}catch(e){
  return res.status(500).json(e.message)
}
});

// router.get('/reports/repeated', async (req, res) => {
// try{
//   let now = moment(moment().format('YYYY-MM-DD'))
//   let monthAgo = moment(moment().subtract(1,'months').format('YYYY-MM-DD'))

//   let issues = await Issue.find()
//   issues = issues.filter(issue => {
//     let issueDate = moment(moment(issue.date).format('YYYY-MM-DD'))
//     return issueDate.isBetween(monthAgo,now)
//   })

//   let issueGroupedIntoSerials = issues.reduce((result, item) => {
//     const key = item.serial;
//     if (key !== undefined && key !== null) {
//       if (!result[key]) {
//         result[key] = [];
//       }
//       result[key].push(item);
//     }
//     return result;
//   }, {});

//   let groupsIntoNumbers = []
//   for(let key in issueGroupedIntoSerials){
//     if(issueGroupedIntoSerials.hasOwnProperty(key) && issueGroupedIntoSerials[key].length > 2){
//       groupsIntoNumbers.push({
//         serial: key,
//         total: issueGroupedIntoSerials[key].length
//       })
//     }
//   }

//   return res.status(200).json(groupsIntoNumbers);
// }catch(e){
//   return res.status(500).json(e.message)
// }
// })


export default router