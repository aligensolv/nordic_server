import { Router } from 'express';
const router = Router();
import IssueReport from '../../models/IssueReport.js';
import jwt from 'jsonwebtoken';
import Manager from '../../models/Manager.js';

import Machine from '../../models/Machine.js';
import Issue from '../../models/Issue.js';
import moment from 'moment';
import SMS from '../../models/SMS.js';
import ComplaintRepository from '../../repositories/Complaint.js';
import SmsRepository from '../../repositories/Sms.js';
import MachineRepository from '../../repositories/Machine.js';
import IssueRepository from '../../repositories/Issue.js';
import IssueReportRepository from '../../repositories/IssueReport.js';

router.get('/reports', async (req, res) => {
  try{

    let reports = await IssueReport.find()
    res.status(200).render('reports/index',{
        reports: reports.reverse(),
    })
  }catch(err){
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.get('/reports/sms', async (req, res) => {
  try {
    let smss = await SMS.find()

    return res.status(200).render('reports/sms',{
      smss: smss
    });
  }catch(err){
    return res.status(500).send(err.message)
  }
})

router.get('/reports/dashboard', async (req, res) => {


  const total_complaints = await ComplaintRepository.getTotalComplaints()
  const total_waiting_complaints = await ComplaintRepository.getTotalComplaints('pending')

  const total_complaints_complete_time = await ComplaintRepository.getTotalComplaintsCompleteTime()
  const average_complaints_complete_time = await ComplaintRepository.getAverageComplaintsCompleteTime()
  const average_complaints_waiting_time = await ComplaintRepository.getAverageComplaintsWaitingTime()
  const total_completed_complaints = await ComplaintRepository.getTotalCompletedComplaints()

  const complaints_graph_data = await ComplaintRepository.getGroupedComplaintsGraphData()
  const users_complaint_waiting_graph_data = await ComplaintRepository.getUsersComplaintWaitingTime()

  const sms_count = await SmsRepository.getTotalSmsCount()

  const inactive_machines_count = await MachineRepository.getTotalMachinesCount('inactive')
  const active_machines_count = await MachineRepository.getTotalMachinesCount('active')
  const waiting_machines_count = await MachineRepository.getTotalMachinesCount('waiting')

  const total_completed_issues = await IssueRepository.getAllTotalIssues('complete')
  const total_waiting_issues = await IssueRepository.getAllTotalIssues('waiting')
  const total_incomplete_issues = await IssueRepository.getAllTotalIssues('incomplete')

  const completed_issues = await IssueRepository.getAllIssues('complete')
  const waiting_issues = await IssueRepository.getAllIssues('waiting')
  const incomplete_issues = await IssueRepository.getAllIssues('incomplete')

  const issues_grouped_by_importance = await IssueRepository.getIssuesDataGroupedByImportanceLevel()
  const issues_grouped_by_month = await IssueRepository.getIssuesDataGroupedByMonth()
  const issues_grouped_by_day = await IssueRepository.getIssuesDataGroupedByDay()

  console.log(issues_grouped_by_day);

  const completed_issues_grouped_by_identifiers = await IssueRepository.getCompletedIssuesGroupedByIdentifier()
  const completed_issues_grouped_into_averages = await IssueRepository.getDaysGroupedIssuesIntoAverages()

  const machines = await MachineRepository.getAllMachines()
  const reports = await IssueReportRepository.getAllReports();

  const total_issues_solve_average = await IssueRepository.getTotalIssueSolveHoursAverage()
  const total_issues_redirect_average = await IssueRepository.getTotalRedirectAverageTime()
  const total_issues_waiting_average = await IssueRepository.getTotalIssueWaitingAverageTime()


  return res.render('reports/dashboard',{
    total_complaints, total_complaints_complete_time, total_completed_complaints, 
    average_complaints_complete_time, average_complaints_waiting_time, total_waiting_complaints,
    complaints_graph_data: JSON.stringify(complaints_graph_data),
    users_complaint_waiting_graph_data: JSON.stringify(users_complaint_waiting_graph_data),
    sms_count,
    inactive_machines_count,active_machines_count,waiting_machines_count,
    machines: JSON.stringify(machines),
    total_completed_issues, total_waiting_issues, total_incomplete_issues,

    completed_issues: JSON.stringify(completed_issues),
    waiting_issues: JSON.stringify(waiting_issues),
    incomplete_issues: JSON.stringify(incomplete_issues),
    issues: [...completed_issues,...waiting_issues,...incomplete_issues],

    issues_grouped_by_importance: JSON.stringify(issues_grouped_by_importance),
    issues_grouped_by_month: JSON.stringify(issues_grouped_by_month),
    issues_grouped_by_day: JSON.stringify(issues_grouped_by_day),
    
    reports: reports,
    completed_issues_grouped_by_identifiers: JSON.stringify(completed_issues_grouped_by_identifiers),
    completed_issues_grouped_into_averages: JSON.stringify(completed_issues_grouped_into_averages),

    total_issues_solve_average, total_issues_redirect_average, total_issues_waiting_average
  })
})

export default router