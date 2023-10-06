import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
// @ts-ignore
const ObjectId = mongoose.Types.ObjectId;

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

// Create sub-test
router.post('/', async (req, res) => {
  try {
    const { name, url } = req.body;
    const doc = {
      _id: new ObjectId(),
      name,
      url
    };
    
    const subTest = new EnvironmentsModel(doc);
    subTest.save();
    res.status(201).json(subTest);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete test
router.delete('/:environmentId', async (req, res) => {
  try {
    const environmentId = req.params.environmentId;
    
    const env = await EnvironmentsModel.findOneAndRemove({ _id: new ObjectId(environmentId) });
    if (!env) {
      return res.status(404).json({ error: `Environment ${environmentId} not found` });
    }
    res.status(200).send('ok');
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;