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

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

app.use("/", routerFunction);
