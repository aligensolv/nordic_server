import { Router } from 'express'
const router = Router()
import PostalScan from '../../models/PostalScan.js'

router.get('/scans',async (req,res) =>{
  try{

    let scans = await PostalScan.find()
    console.log(scans);
    return res.status(200).render('scans/read',{
      scans
    })
  }catch(error){
    return res.status(500).json(error.message)
  }
})

router.get('/scans/:id', async (req, res) => {
  try {

      const scan = await PostalScan.findById(req.params.id);
      if (!scan) {
          return res.status(404).json({ error: 'PDF not found' });
      }
      let link = scan.link
      return res.status(200).render('scans/postal_show', { 
        link,
       });
  } catch (error) {
    console.log(error.message)
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router