import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
// @ts-ignore
const ObjectId = mongoose.Types.ObjectId;

import UserModel from '../models/user-model';

router.get('/', async (req, res) => {
  const { organisationId } = req.query;
  try {
    const data = await UserModel.find({ organisationId });
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create organisation
router.post('/', async (req, res) => {
  try {
    const { organisationId, name, email ,password, role } = req.body;
    const doc = {
      _id: new ObjectId(),
      organisationId,
      name,
      email,
      password,
      role
    };
    
    const organisation = new UserModel(doc);
    organisation.save();
    res.status(201).json(organisation);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;