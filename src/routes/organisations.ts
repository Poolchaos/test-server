import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
// @ts-ignore
const ObjectId = mongoose.Types.ObjectId;

import OrganisationsModel from '../models/organisations-model';
import UserModel from '../models/user-model';

router.get('/', async (req, res) => {
  const { environment } = req.query;
  try {
    let organisations: any = await OrganisationsModel.find({ environment });
    let promises = [];

    organisations.forEach(org => 
      promises.push(
        new Promise(resolve => {
          UserModel.find({ organisationId: new ObjectId(org._id) })
          .then(users => {
            org.users = users;
            resolve(org);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
            resolve(org);
          });
        })
      )
    );

    Promise
      .all(promises)
      .then(data => {
        res.json(data);
      });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create organisation
router.post('/', async (req, res) => {
  try {
    const { name, environment } = req.body;
    const doc = {
      _id: new ObjectId(),
      name,
      environment
    };
    
    const organisation = new OrganisationsModel(doc);
    organisation.save();
    res.status(201).json(organisation);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete organsiation
router.delete('/:organisationId', async (req, res) => {
  try {
    const organisationId = req.params.organisationId;
    
    const organisation = await OrganisationsModel.findOneAndRemove({ _id: new ObjectId(organisationId) });
    console.log(' ::>> organisation ', organisation);

    if (!organisation) {
      return res.status(404).json({ error: `Organisation with ID ${organisationId} was not found` });
    }

    await UserModel.deleteMany({ organisationId: new ObjectId(organisationId) });

    res.json({ status: 'deleted', organisationId });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;