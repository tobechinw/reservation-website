const jwt = require('jsonwebtoken')

const mongo = require('../db/mongodb')

module.exports = {
    getCheckedInEmployees,
    getCheckedOutEmployees,
    checkInUser,
    checkOutUser
}


async function getCheckedInEmployees(){
    const employees = await mongo.getCheckedInEmployees()
    return employees
}

async function getCheckedOutEmployees(){
    const employees = await mongo.getCheckedOutEmployees()
    return employees
}

async function checkInUser({shellID, checkInDate, checkOutDate, roomNumber}){
    return await mongo.checkInUser(shellID, checkInDate, checkOutDate, roomNumber)
}

async function checkOutUser({shellID}){
    return await mongo.checkOutUser(shellID)
}