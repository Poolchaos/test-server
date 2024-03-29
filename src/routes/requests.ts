import express from 'express';
var router = express.Router();
import RequestsModel from '../models/requests-model';

router.get('/', async (req, res) => {
  try {
    const data = await RequestsModel.find();
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
export default router;