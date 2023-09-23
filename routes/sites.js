var express = require('express');
var router = express.Router();
const SitesModel = require('../models/sites-model');

router.get('/', async (req, res) => {
  try {
    const data = await SitesModel.find({ organisationId: '4767c999-78fb-49cb-880e-4ff6e4f7e28c' });
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
module.exports = router;