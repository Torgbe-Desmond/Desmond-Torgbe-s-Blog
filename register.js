const { StatusCodes } = require("http-status-codes");

async function registerFunction(req,res) {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'paydesmond',  //
          password: 'paydesmond@2014'  
        }),
      });
  
      res.status(StatusCodes.CREATED).json(response.data)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  module.exports = registerFunction;