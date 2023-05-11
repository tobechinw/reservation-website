const express = require('express')
const router = express.Router()

const employeesService = require('./employeesService')

router.get('/add-employee', (request, response)=>{
    response.render('addEmployee.pug')
})

router.get('/all-employees', getAll)


router.get('/remove-employee', (request, response)=>{
    employeesService.getAll()
        .then(employees => employees ? response.render('removeEmployee.pug', {employees: employees}) : response.status(400).json({message: 'Could not get all users'}))
        .catch(err => next(err))
})


router.post('/add-employee', addEmployee)

router.post('/remove-employee', removeEmployee)



function getAll(request, response, next){
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