const mongo = require('../db/mongodb')

module.exports = {
    getAll,
    addEmployee,
    removeEmployee
}

async function getAll(){
    const users = await mongo.getAllEmployees()
    return users
}

async function addEmployee({lastname, firstname, shellID, category, gender, department}){
    await mongo.addEmployee(lastname, firstname, shellID, category, gender, department)
    return
}

async function removeEmployee({shellID}){
    await mongo.removeEmployee(shellID)
    return
}