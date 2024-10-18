const express = require('express');
const { handleQuery, fetchResponses } = require('../controllers/chatbotController');  
const router = express.Router();

router.post('/query', handleQuery);
router.get('/responses', fetchResponses);

module.exports = router;
