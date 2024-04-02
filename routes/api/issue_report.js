import { Router } from 'express'
const router = Router()
import IssueReport from '../../models/IssueReport.js'

router.delete('/reports/:id', async (req, res) => {
    try{
        await IssueReport.deleteOne({
            _id: req.params.id
        })
        return res.status(200).json('success')
    }catch(err){
        console.log(err.message)
        return res.status(500).json(err.message)
    }
})

export default router