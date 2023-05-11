const express = require('express')
const router = express.Router()

const roomsService = require('./roomsService')

router.get('/add-room', (request, response) =>{
    response.render('addRoom.pug')
})

router.get('/room/:id', getRoomByID)

router.get('/all-rooms', getAll)

router.get('/available-rooms', getAvailableRooms)

router.get('/statistics', getStatistics)

router.post('/add-room', addRoom)

router.get('/check-availability', (request, response)=>{
    response.end()
})

router.get('/edit/:roomNum', (request, response)=>{
    roomsService.getByNumber(request.params)
        .then(room => room ? response.render('editroom.pug', {room : room}) : response.status(400).json({message: `Could not get room`}))
        .catch(err => {throw err})
})

router.get('/delete-room', (request, response)=>{
    roomsService.getAll()
        .then(rooms => rooms ? response.render('removeroom.pug', {rooms: rooms}) : response.status(400).json({message: 'Could not get rooms'}))
        .catch(err => next(err))
})

router.post('/edit/:roomNum', (request, response)=>{
    roomsService.updateRoomInfo(request.params, request.body)
        .then(routeResp =>{
            if(routeResp == undefined)
                return response.redirect('/rooms/all-rooms')
            return response.status(400).json({message: routeResp})
        }).catch(err =>{throw err})
})

router.post('/delete-room', (request, response) =>{
    roomsService.deleteRoom(request.body)
        .then(routeResp =>{
            if(routeResp == undefined)
                return response.redirect('/')
            return response.status(400).json({message: routeResp})
        }).catch(err => {throw err})
})

function addRoom(request, response, next){
    console.log(request.body)
    roomsService.addRoom(request.body)
        .then(routeResp =>{
            if (routeResp == undefined)
                return response.redirect('/rooms/all-rooms')
            return response.status(400).json({message: routeResp})
        }).catch(err => {throw err})
}

function getAll(request, response, next){
    roomsService.getAll()
        .then(rooms => rooms ? response.render('allRooms.pug', {rooms: rooms}) : response.status(400).json({message: 'Could not get all rooms'}))
        .catch(err => {throw err})
}

function getRoomByID(request, response, next){
    roomsService.getByNumber(request.params)
        .then(room => room ? console.log(room) : response.status(400).json({message: 'could not get room with that ID'}))
        .catch(err => {throw err})
}

function getAvailableRooms(request, response, next){
    roomsService.getAvailableRooms()
        .then(rooms => rooms ? response.render('availableRooms.pug', {rooms: rooms}) : response.status(400).json({message: 'Could not get available rooms'}))
        .catch(err => next(err))
}

function getStatistics(request, response, next){
    roomsService.getStatistics()
        .then(statistics =>{
            if(statistics){
                console.log(`statistics are ${statistics}`)
                let data = statistics.map(item => ({
                    label: item._id,
                    value: item.count
                }));
                // let data = [ { label: 'SN', value: 3 }, { label: 'Expert', value: 1 } ]  
                const labels = data.map((item) => item.label)
                const value = data.map((item) => item.value)
                console.log(labels)
                console.log(value)
                const finalData = {
                    labels: labels,
                    datasets: [{
                      label: 'My Dataset',
                      data: data
                    }]
                  };
                  console.log(finalData)
                return response.render('statistics.pug', {data: finalData})
                // return response.render('statistics.pug', {data: labels})                
            }
            return response.status(400).json({message: 'Could not get statistics'})
        })
        .catch(err => {throw err})
    }

module.exports = router