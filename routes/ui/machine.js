import { Router } from 'express';
import MachineRepository from '../../repositories/Machine.js';
const router = Router();

router.get('/machines', async (req, res) => {
    try {

      let machines = await MachineRepository.getAllMachines();
  
      // Sort the machines array so that "inactive" machines come first
      machines.sort((a, b) => {
        if (a.status === 'inactive' && b.status !== 'inactive') {
          return -1;
        } else if (a.status !== 'inactive' && b.status === 'inactive') {
          return 1;
        }
        return 0; // If statuses are the same, maintain the current order
      });
  
      res.status(200).render('machines/index', { 
        machines
       });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json(err.message);
    }
  });
  

router.get('/machines/create', async (req, res) => {
    try{

        return res.status(200).render('machines/new');
    }catch (err){
        console.log(err.message);
        return res.status(500).json(err.message);
    }
})

router.get('/machines/:id/edit', async (req, res) => {
    try{

        let machine = await MachineRepository.getMachineById(req.params.id)
        return res.status(200).render('machines/edit', { 
          machine,
          jsMachine: JSON.stringify(machine)
         });
    }catch(err){
        console.log(err.message);
        return res.status(500).json(err.message);
    }
})

router.get('/machines/:id/qrcode', async (req,res) =>{
    try{

      let machine = await MachineRepository.getMachineById(req.params.id)
      return res.status(200).render('machines/machine_qrcode_view',{
        machine,
      })
    }catch (error){
      return res.status(500).render('errors/internal',{
        error: error.message
      })
    }
  })


export default router