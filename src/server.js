const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const path = require('path');



app.use(express.static('public'));
app.set("view engine", "ejs")
app.set("view engine", "pug")

app.use('/views', express.static("./src/views"));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/index.js'))


const port = process.env.PORT || 3000


app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`)
})