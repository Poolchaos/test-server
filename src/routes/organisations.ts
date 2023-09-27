import express from 'express';
var router = express.Router();
import OrganisationsModel from '../models/organisations-model';

router.get('/', async (req, res) => {
  const { environment } = req.query;
  try {
    const data = await OrganisationsModel.find({ environment });
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;