const jwt = require('jsonwebtoken')

const mongo = require("#db/mongodb")

module.exports = {
    addRoom,
    getAvailableRooms,
    getAll,
    getByNumber,
    deleteRoom,
    updateRoomInfo,
    getStatistics
}

async function getStatistics(){
    const statistics = await mongo.getStatistics()
    console.log(statistics)
    return statistics
}


async function addRoom({roomNum, extension, beds}){
    return await mongo.addRoom(roomNum, extension, beds)
}

async function getByNumber({roomNum}){
    const room = await mongo.getRoomByNumber(roomNum)
    return room
}

async function getAvailableRooms(){
    const rooms = await mongo.getAvailableRooms()
    return rooms
}

async function getAll(){
    const rooms = await mongo.getAllRooms()
    return rooms
}

async function deleteRoom({roomNumber}){
    return await mongo.deleteRoom(roomNumber)
}

async function updateRoomInfo({roomNum}, {roomNumber, extension, beds}){
    return await mongo.updateRoomInfo(roomNum, roomNumber, extension, beds)
}