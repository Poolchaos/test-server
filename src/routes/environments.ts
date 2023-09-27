import express from 'express';
var router = express.Router();
import EnvironmentsModel from '../models/environments-model';

router.get('/', async (req, res) => {
  try {
    const data = await EnvironmentsModel.find();
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
export default router;