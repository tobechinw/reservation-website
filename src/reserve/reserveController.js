const express = require('express')
const router = express.Router()

const reserveService = require('./reserveService')
const roomsService = require('../rooms/roomsService')
const verifyjwt = require('../helpers/verifyjwt')
const cookieParser = require('cookie-parser')
const authorize = require('../helpers/authorize')
const Role = require('../helpers/roles')
router.use(cookieParser())
router.use(verifyjwt)

router.get('/check-in', authorize(Role.Admin), (request, response) =>{
    Promise.all([
        reserveService.getCheckedOutEmployees(),
        roomsService.getAvailableRooms()
    ])
    .then(([employees, availableRooms]) =>{
        if(employees && availableRooms) {
            response.render('checkin.pug', {
                employees: employees,
                rooms: availableRooms
            })
        }else{
            response.status(400).json({message: 'Could not load data'})
        }
    })
    .catch( err => next(err))
})


router.get('/check-out', authorize(Role.Admin), (request, response) =>{
    reserveService.getCheckedInEmployees()
        .then(employees => employees ? response.render('checkout.pug', {employees: employees}) : response.status(400).json({message: 'Could not get all users'}))
        .catch(err => next(err))
})

router.post('/check-in', authorize(Role.Admin), checkInUser)

router.post('/check-out', authorize(Role.Admin), checkOutUser)


function checkInUser(request, response, next){
    reserveService.checkInUser(request.body)
        .then(routeResp =>{
            if (routeResp == undefined)
                return response.redirect('/')
            return response.status(400).json({message: routeResp})
        }).catch(err => next(err))
}

function checkOutUser(request, response, next){
    reserveService.checkOutUser(request.body)
        .then(routeResp =>{
            if (routeResp == undefined)
                return response.status(200).json()
            return response.status(400).json({message: routeResp})
        }).catch(err => next(err))
}

module.exports = router