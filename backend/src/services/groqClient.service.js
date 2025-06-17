// services/groqClient.js
const { Groq } = require('groq-sdk');


let groq = null;

// Solo carga el cliente si no estamos en test
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY no definida');
  }

  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

module.exports = groq;