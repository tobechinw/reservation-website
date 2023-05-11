const express = require('express')
const router = express.Router()

router.get('/', (request, response) =>{
    response.render('homepage.pug')
})

router.get('/version', (request, response) =>{
    const version = getVersion()
    response.json({version: version})
})

function getVersion(){
    const {version} = require('../../package.json')
    return version;
}

module.exports = router