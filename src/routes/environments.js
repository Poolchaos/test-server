var express = require('express');
var router = express.Router();
const EnvironmentsModel = require('../models/environments-model');

router.get('/', async (req, res) => {
  try {
    const data = await EnvironmentsModel.find();
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;