const axios = require('axios');
const ResponseModel = require('../models/ChatResponse');  

// Handle user chatbot query (POST /query) using Hugging Face API
const handleQuery = async (req, res) => {
  const { userId, query } = req.body;  

  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    
    const apiResponse = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',  // Hugging Face GPT-2 model endpoint
      {
        inputs: query,  
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  // Hugging Face API Key from .env
          'Content-Type': 'application/json',
        }
      }
    );

  
    const resultText = apiResponse.data?.[0]?.generated_text?.trim() || "No response generated";

    
    const responseToSave = {
      summary: resultText,  
      result_text: resultText,
      result_table_path: null,  
      result_visualization_path: null, 
      error: null  
    };

    
    const newResponse = new ResponseModel({
      userId,  
      userQuery: query,  
      apiResponse: responseToSave,  
    });

    await newResponse.save();  

   
    res.status(200).json(responseToSave);
  } catch (error) {
    console.error('Error with Hugging Face API:', error.message);

    
    const errorResponse = {
      summary: null,
      result_text: null,
      result_table_path: null,
      result_visualization_path: null,
      error: error.message || 'Failed to process the query'
    };

    
    const newErrorResponse = new ResponseModel({
      userId,  
      userQuery: query,  
      apiResponse: errorResponse  
    });

    await newErrorResponse.save();  

    
    res.status(500).json(errorResponse);
  }
};


const fetchResponses = async (req, res) => {
  try {
    const responses = await ResponseModel.find(); 
    res.status(200).json(responses);  
  } catch (error) {
    console.error('Error fetching responses:', error.message);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

module.exports = { handleQuery, fetchResponses };
