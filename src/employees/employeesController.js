const express = require('express')
const router = express.Router()

const employeesService = require('./employeesService')
const verifyjwt = require('#helpers/verifyjwt')
const cookieParser = require('cookie-parser')
const authorize = require('#helpers/authorize')
const Role = require('#helpers/roles')
router.use(cookieParser())
router.use(verifyjwt)

router.get('/add-employee', authorize(Role.Admin), (request, response)=>{
    response.render('addEmployee.pug')
})

router.get('/all-employees', authorize(), getAll)

router.get('/remove-employee', authorize(Role.Admin), (request, response)=>{
    employeesService.getAll()
        .then(employees => employees ? response.render('removeEmployee.pug', {employees: employees}) : response.status(400).json({message: 'Could not get all users'}))
        .catch(err => next(err))
})

router.post('/add-employee', authorize(Role.Admin), addEmployee)

router.post('/remove-employee', authorize(Role.Admin), removeEmployee)

function getAll(request, response, next){
    console.log('about to log cookies token')
    console.log(request.cookies.token)
    employeesService.getAll()
        .then(employees => employees ? response.render('allEmployees.pug', {employees: employees}) : response.status(400).json({message: 'Could not get all users'}))
        .catch(err => next(err))
}

function addEmployee(request, response, next){
    employeesService.addEmployee(request.body)
        .then(routeResp =>{
            if (routeResp == undefined)
                return response.redirect('/employees/all-employees')
            return response.status(400).json({message: routeResp})
        })
        .catch(err => next(err))
}

function removeEmployee(request, response, next){
    employeesService.removeEmployee(request.body)
        .then(routeResp =>{
            if (routeResp == undefined)
                return response.redirect('/')
            return response.status(400).json({message: routeResp})
        })
        .catch(err => next(err))
}

module.exports = router