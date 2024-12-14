require("dotenv").config();
require('./config/database').connect();

const express = require('express');
const cors = require('cors');

const app= express();
const adminRoutes = require('./Routes/adminRoutes')
const studentRoutes=require('./Routes/studentRoutes')
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use('/admin',adminRoutes)
module.exports=app
