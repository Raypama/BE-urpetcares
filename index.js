require('dotenv').config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");


const app = express(); //cara menggunakan si corse ny
app.use(cors());
app.use('/uploads', express.static('uploads')) // untuk buat path file upload

app.use(express.json())//berfungsi untuk nangkap request body dari method post
app.use(router);

const PORT = 8000


app.listen(PORT, () => console.log('server is a running'));
