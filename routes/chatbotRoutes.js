const express = require('express');
const { handleQuery, fetchResponses } = require('../controllers/chatbotController');  // Ensure paths are correct
const router = express.Router();

router.post('/query', handleQuery);
router.get('/responses', fetchResponses);

module.exports = router;
