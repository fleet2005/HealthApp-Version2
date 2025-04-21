const express = require("express");
const dotenv = require("dotenv").config();
const routerFunction = require("./routes");
const connectDB = require("./mongoconn");

const cors = require('cors');

const app= express();
const port = process.env.PORT|| 5001;

app.use(cors());
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
