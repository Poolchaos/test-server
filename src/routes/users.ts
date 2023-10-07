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

// Create user
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
    
    const user = new UserModel(doc);
    user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete test
router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await UserModel.findOneAndRemove({ _id: new ObjectId(userId) });
    console.log(' ::>> user ', user);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} was not found` });
    }
    res.json({ status: 'deleted', user });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;