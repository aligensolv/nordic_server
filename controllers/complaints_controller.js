import { static_absolute_files_host } from "../config.js";
import { BAD_REQUEST, OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ComplaintRepository from "../repositories/Complaint.js";
import UserRepository from "../repositories/User.js";
import ValidatorRepsitory from "../repositories/Validator.js";

export const getAllComplaints = asyncWrapper(
    async (req, res) => {
        const {status} = req.query

        const complaints = await ComplaintRepository.getAllComplaints(status)
        return res.status(OK).json(complaints);
    }
)

export const getComplaintById = asyncWrapper(
    async (req, res) => {
        const complaint = await ComplaintRepository.getComplaintById(req.params.id)
        return res.status(OK).json(complaint);
    }
)

export const getAllClientComplaints = asyncWrapper(
    async (req, res) => {
        const complaints = await ComplaintRepository.getAllClientComplaints(req.params.id)
        return res.status(OK).json(complaints);
    }
)

export const createComplaint = asyncWrapper(
    async (req, res) => {
        const { type, other_type_description, phone_number, plate_number, location } = req.body

        const image_link = req.file != null ? static_absolute_files_host + 'images/complaints/client/' + req.file.filename : null
        console.log(req.file);
        

        const complaint = await ComplaintRepository.createComplaint({ 
            type, 
            phone_number, 
            other_type_description,
            plate_number: plate_number, 
            location: JSON.parse(location),
            image: image_link
        })
        return res.status(OK).json(complaint);
    }
)

export const deleteAllComplaints = asyncWrapper(
    async (req, res) => {
        const complaints = await ComplaintRepository.deleteAllComplaints()
        return res.status(OK).json(complaints);
    }
)


export const deleteComplaintById = asyncWrapper(
    async (req, res) => {
        const complaint = await ComplaintRepository.deleteComplaintById(req.params.id)
        return res.status(OK).json(complaint);
    }
)

export const generateComplaintQrCode = asyncWrapper(
    async (req, res) => {
        const {location} = req.body
        
        const complaint = await ComplaintRepository.generateComplaintQrCode(location)
        return res.status(OK).json(complaint);
    }
)

export const loginClient = asyncWrapper(
    async (req, res) => {
        const { national_id } = req.body

        const access_token = await ComplaintRepository.loginClient(national_id)
        return res.status(OK).json(access_token);
    }
)

export const getAllDriverAcceptedComplaints = asyncWrapper(
    async (req, res) => {
        const complaints = await ComplaintRepository.getAllDriverAcceptedComplaints(req.params.id)
        console.log(req.params.id);
        console.log(complaints);
        return res.status(OK).json(complaints);
    }
)

export const getAllDriverCompletedComplaints = asyncWrapper(
    async (req, res) => {
        const complaints = await ComplaintRepository.getAllDriverCompletedComplaints(req.params.id)
        return res.status(OK).json(complaints);
    }
)

export const acceptComplaint = asyncWrapper(
    async (req, res) => {
        const complaint_id = req.params.id
        const {user_id} = req.body

        const complaint = await ComplaintRepository.acceptComplaint({
            complaint_id,
            user_id
        })
        return res.status(OK).json(complaint);
    }
)

export const completeComplaint = asyncWrapper(
    async (req, res) => {
        const complaint_id = req.params.id
        const {user_id, not_violated_reason, was_solved, was_violated} = req.body

        if(JSON.parse(was_violated) && !req.file){
            return res.status(BAD_REQUEST).json({
                error: 'Violation image is required'
            })
        }

        const violation_image = req.file != null ? static_absolute_files_host + 'images/complaints/driver/' + req.file.filename : null
        const user = await UserRepository.getUserById(user_id)

        const complaint = await ComplaintRepository.completeComplaint({
            complaint_id, 
            violation_image,
            not_violated_reason: JSON.parse(not_violated_reason),
            was_solved: JSON.parse(was_solved),
            was_violated: JSON.parse(was_violated),
            user
        })
        return res.status(OK).json(complaint);
    }
)