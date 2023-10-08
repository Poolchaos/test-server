import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
  res.send('ok');
});

export default router;