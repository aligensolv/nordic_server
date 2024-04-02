import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import IssueRepository from "../repositories/Issue.js";

export const getAllVerifiedIssues = asyncWrapper(
    async (req, res) => {
        const issues = await IssueRepository.getAllVerifiedIssues()
        return res.status(OK).json(issues);
    }
)

export const getAllIssues = asyncWrapper(
    async (req, res) => {
        const { status } = req.query
        const issues = await IssueRepository.getAllIssues(status)
        return res.status(OK).json(issues);
    }
)

export const createIssue = asyncWrapper(
    async (req, res) => {
        const { machine_id,publisher,pnid,notes,category,boardNumber, problem,importanceLevel, phone  } = req.body
        const result = await IssueRepository.createIssue({ machine_id,publisher,pnid,notes,category,boardNumber, problem,importanceLevel, phone  })
        return res.status(OK).json(result);
    }
)

export const deleteIssueById = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const result = await IssueRepository.deleteIssueById(id)
        return res.status(OK).json(result);
    }
)

export const deleteAllIssues = asyncWrapper(
    async (req, res) => {
        const result = await IssueRepository.deleteAllIssues()
        return res.status(OK).json(result);
    }
)

export const setIssueInWaitingState = asyncWrapper(
    async (req, res) => {
        const { reason } = req.body
        const issue_id = req.params.id
        const result = await IssueRepository.setIssueInWaitingState({ issue_id, reason })
        return res.status(OK).json(result);
    }
)