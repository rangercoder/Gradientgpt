const axios = require('axios');
const ResponseModel = require('../models/ChatResponse');  // MongoDB model for responses

// Handle user chatbot query (POST /query) using Hugging Face API
const handleQuery = async (req, res) => {
  const { userId, query } = req.body;  // Expect userId and query in the request body

  // Check if the query is provided
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Optional: Check if userId is provided (for internal purposes only, not sent to Hugging Face)
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Send the query to Hugging Face's inference API
    const apiResponse = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',  // Hugging Face GPT-2 model endpoint
      {
        inputs: query,  // Send the user query in the "inputs" field
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,  // Hugging Face API Key from .env
          'Content-Type': 'application/json',
        }
      }
    );

    // Safely extract the generated text from Hugging Face's API response
    const resultText = apiResponse.data?.[0]?.generated_text?.trim() || "No response generated";

    // Construct the apiResponse object to match the provided structure
    const responseToSave = {
      summary: resultText,  // Use resultText as summary and result_text
      result_text: resultText,
      result_table_path: null,  // Placeholder for any table data (if available)
      result_visualization_path: null,  // Placeholder for visual data (if available)
      error: null  // Set to null since the API call succeeded
    };

    // Save the response to MongoDB, ensuring the schema is followed
    const newResponse = new ResponseModel({
      userId,  // Save the userId (internal purpose only, not sent to Hugging Face)
      userQuery: query,  // Save the original user query
      apiResponse: responseToSave,  // Save the structured API response
    });

    await newResponse.save();  // Save the response document in MongoDB

    // Send the result back to the frontend
    res.status(200).json(responseToSave);
  } catch (error) {
    console.error('Error with Hugging Face API:', error.message);

    // Handle the error, log it, and send an error response
    const errorResponse = {
      summary: null,
      result_text: null,
      result_table_path: null,
      result_visualization_path: null,
      error: error.message || 'Failed to process the query'
    };

    // Save the error response in MongoDB as well
    const newErrorResponse = new ResponseModel({
      userId,  // Save the userId (internal purpose only)
      userQuery: query,  // Save the original user query
      apiResponse: errorResponse  // Save the error response structure
    });

    await newErrorResponse.save();  // Save the error response document in MongoDB

    // Send the error response back to the client
    res.status(500).json(errorResponse);
  }
};

// Fetch all saved chatbot responses (GET /responses)
const fetchResponses = async (req, res) => {
  try {
    const responses = await ResponseModel.find();  // Fetch all responses from MongoDB
    res.status(200).json(responses);  // Return the responses as JSON
  } catch (error) {
    console.error('Error fetching responses:', error.message);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

module.exports = { handleQuery, fetchResponses };
