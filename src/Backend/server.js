const axios = require('axios');
const express = require('express');
const app = express();



app.use(express.json());


app.post('/api/webhook', (req, res) => {

    const { name, id } = req.body;

    // Print the received data to the console
    console.log('Data received from Zapier:');
    console.log('Name:', name);
    console.log('ID:', id);

    // Respond back to Zapier with a success message
    res.status(200).send('Webhook received successfully');
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});