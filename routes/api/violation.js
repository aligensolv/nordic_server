import { Router } from 'express'
import { getTotalRemovedViolationsCount, getUserRemovedViolationsCount, getUserViolations, getViolationById, getViolationCount } from '../../controllers/violation_controller.js'
const router = Router()
import Violation from '../../models/Violation.js'

router.get('/violations/count', getViolationCount)
router.get('/violations/removed/count', getTotalRemovedViolationsCount)

router.get('/violations/:id', getViolationById)


router.get('/violations/users/:id', getUserViolations)

router.get('/violations/users/:id/removed/count', getUserRemovedViolationsCount)

router.get('/violations/ks/:id',async (req,res) =>{
    try{
      let { id } = req.params
  
      if(id == 0){
        let violations = await Violation.find({})
        let totalViolations = 0;
      
        violations.forEach(violation => {
          totalViolations += violation.violations;
        });
  
        return res.send(totalViolations.toString())      
      }else if(id == 1){
      const now = new Date();
      const localDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const localDateString = localDate.toISOString().split('T')[0];
  console.log(localDate.toISOString())
  
        let violations = await Violation.find({
          createdAt: localDateString
        })
        let totalViolations = 0;
      
        violations.forEach(violation => {
          totalViolations += violation.violations;
        });
  
        return res.send(totalViolations.toString())      
      }else if(id == 2){      const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
  
  
        try {
          const result = await Violation.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: threeDaysAgo.toISOString(), // Filter for documents created after three days ago
                  $lt: now.toISOString() // Filter for documents created until now
                }
              }
            },
            {
              $group: {
                _id: null,
                totalViolations: { $sum: '$violations' } // Sum the violations field
              }
            }
          ]);
  
          const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
          console.log('Total violations in the last 3 days:', totalViolations);
          return res.send(totalViolations.toString())
        } catch (err) {
          console.error('Error:', err);
        }
      }else if(id == 3){
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
  
        try {
          const result = await Violation.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: oneWeekAgo.toISOString(), // Filter for documents created after one week ago
                  $lt: now.toISOString() // Filter for documents created until now
                }
              }
            },
            {
              $group: {
                _id: null,
                totalViolations: { $sum: '$violations' } // Sum the violations field
              }
            }
          ]);
  
          const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
          console.log('Total violations in the last one week:', totalViolations);
          return res.send(totalViolations.toString())
        } catch (err) {
          console.error('Error:', err);
        }
      }else if(id == 4){
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
  
        try {
          const result = await Violation.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: oneMonthAgo.toISOString(), // Filter for documents created after one month ago
                  $lt: now.toISOString() // Filter for documents created until now
                }
              }
            },
            {
              $group: {
                _id: null,
                totalViolations: { $sum: '$violations' } // Sum the violations field
              }
            }
          ]);
  
          const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
          console.log('Total violations in the last one month:', totalViolations);
          return res.send(totalViolations.toString())
        } catch (err) {
          console.error('Error:', err);
        }
      }else if(id == 5){
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
  
        try {
          const result = await Violation.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: oneYearAgo.toISOString(), // Filter for documents created after one year ago
                  $lt: now.toISOString() // Filter for documents created until now
                }
              }
            },
            {
              $group: {
                _id: null,
                totalViolations: { $sum: '$violations' } // Sum the violations field
              }
            }
          ]);
  
          const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
          console.log('Total violations in the last one year:', totalViolations);
          return res.send(totalViolations.toString())
        } catch (err) {
          console.error('Error:', err);
        }
      }else if(id == 6){
        const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formattedYesterday = yesterday.toISOString().split('T')[0];
  
  try {
    const result = await Violation.aggregate([
      {
        $match: {
          createdAt: formattedYesterday
        }
      },
      {
        $group: {
          _id: null,
          totalViolations: { $sum: '$violations' } // Sum the violations field
        }
      }
    ]);
  
    const totalViolations = result.length > 0 ? result[0].totalViolations : 0;
    console.log('Total violations for yesterday:', totalViolations);
    return res.send(totalViolations.toString());
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send(err.message);
  }
  
      }else{
        return res.send("0")
      }
    }catch(error){
      console.log(error.message)
      return res.status(500).send(error.message)
    }
  })


export default router