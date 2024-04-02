import { Router } from 'express'
const router = Router()
import PostalViolation from '../../models/PostalViolation.js'

router.get('/postals',async (req,res) =>{
  try{

    let postals = await PostalViolation.find()
    return res.status(200).render('postals/read',{
      postalViolations: postals,
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/postals/:id', async (req, res) => {
  try {

      const postal = await PostalViolation.findById(req.params.id);
      if (!postal) {
          return res.status(404).json({ error: 'PDF not found' });
      }
      let link = postal.link
      return res.status(200).render('postals/postal_show', { 
        link,
       });
  } catch (error) {
    console.log(error.message)
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router