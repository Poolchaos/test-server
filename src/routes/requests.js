var express = require('express');
var router = express.Router();
const RequestsModel = require('../models/requests-model');

router.get('/', async (req, res) => {
  try {
    const data = await RequestsModel.find();
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;