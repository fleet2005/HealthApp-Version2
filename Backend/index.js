const express = require("express");
const dotenv = require("dotenv").config();
const routerFunction = require("./routes");
const connectDB = require("./mongoconn");

const cors = require('cors');

const app= express();
const port = process.env.PORT|| 5001;

app.use(cors({
    origin: 'https://health-app-version2-ke87.vercel.app',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self'");
    next();
}); //preventing xss attacks

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

app.use("/", routerFunction);


// What Happens with Thunder Client/Postman?
// Thunder Client and Postman don't enforce CORS. When you use these tools, they just send the request to the backend server, and the server responds normally.

// CORS headers are not required for Thunder Client/Postman requests, because these tools are not browsers and therefore don't block the response based on CORS.

// The server's behavior:
// The server does not reject the request (in the case of Thunder Client/Postman) because CORS is a browser-only security feature. The backend will respond to the request as normal, regardless of the origin.

// If you're making requests from a browser that doesn't match the allowed origin, the browser itself will block access to the response, and you won’t be able to access it from your JavaScript code. The server is still receiving and processing the request, though.

// In summary:
// Browser-based requests: The server responds with CORS headers if the Origin matches. The browser will block the response if the headers don't match.

// Thunder Client/Postman: The server responds normally, without any CORS restrictions since these tools don't enforce CORS.