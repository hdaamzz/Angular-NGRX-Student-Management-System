require("dotenv").config();
require('./config/database').connect();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app= express();
const adminRoutes = require('./Routes/adminRoutes')
const studentRoutes=require('./Routes/studentRoutes')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use('/admin',adminRoutes)
module.exports=app
