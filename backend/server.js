const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/generate-link', async (req, res) => {
    try {
        const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

        // Send a POST request to Zapier to generate a new link
        const zapierResponse = await axios.post(zapierWebhookUrl, {
            realtorId: req.body.realtorId // Customize payload as needed
        });

        // Assuming Zapier sends back the link in zapierResponse.data.link
        // const generatedLink = req.body.link;
        // const generatedLink = zapierResponse.data.link;
        
        const generatedLink = "TEMP";
        if (generatedLink) {
            console.log("Received link from Zapier:", generatedLink);
            res.json({ link: generatedLink });
        } else {
            console.error("Error: Zapier response does not contain a link.");
            res.status(500).json({ error: "Failed to generate link." });
        }
    } catch (error) {
        console.error('Error generating link from Zapier:', error);
        res.status(500).send('Error generating link');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
