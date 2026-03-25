// require("dotenv").config();

// const http = require('http');
// const ngrok = require('@ngrok/ngrok');

// // Create webserver
// http.createServer((req, res) => {
// 	res.writeHead(200, { 'Content-Type': 'text/html' });
// 	res.end('Congrats you have created an ngrok web server');
// }).listen(8080, () => console.log('Node.js web server at 8080 is running...'));

// // Start ngrok
// ngrok.connect({
// 	addr: 8080,
// 	authtoken: process.env.NGROK_AUTHTOKEN
// })
// .then(listener => {
// 	console.log(`Ingress established at: ${listener.url()}`);
// });



require("dotenv").config();

const express = require("express");
const ngrok = require("@ngrok/ngrok");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// 🔥 Your endpoint
app.post("/webhook/add", (req, res) => {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    // You can process/store data here

    res.status(200).json({
        message: "Webhook received successfully",
        data: req.body
    });
});



// Start server
const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Start ngrok
    const listener = await ngrok.connect({
        addr: PORT,
        authtoken: process.env.NGROK_AUTHTOKEN
    });

    console.log(`Public URL: ${listener.url()}`);
});
