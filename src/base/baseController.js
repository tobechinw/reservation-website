const express = require('express')
const router = express.Router()

const verifyjwt = require('../helpers/verifyjwt')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const baseService = require('./baseService')
const sessionConfig = require('../helpers/sessionConfig')
router.use(cookieParser())
router.use(session(sessionConfig))

router.post('/login', authenticate)

function authenticate(request, response, next){
    baseService.authenticate(request.body)
    .then(token =>{
        request.session.user = {
            token: token
        };
        response.redirect('/home')
    }).catch(err => response.render('login.pug', {error: 'Username or password is incorrect'}))
}

router.get('/', (request, response)=>{
    if(request.session.user){
        response.redirect('/home')
    }else{
        response.redirect('/login')
    }
})

router.get('/login', (request, response)=>{
    response.render('login.pug')
})

router.get('/version', (request, response) =>{
    const version = getVersion()
    response.json({version: version})
})

router.use(verifyjwt)

router.get('/home', (request, response)=>{
    response.render('homepage.pug')
})

function getVersion(){
    const {version} = require('../../package.json')
    return version;
}

module.exports = router