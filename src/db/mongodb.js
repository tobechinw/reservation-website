const mc = require('mongodb').MongoClient


// const { MONGODB } = require('../config')

const MONGODB = process.env.MONGODB

module.exports = {
    getAllEmployees,
    getAllRooms,
    getAvailableRooms,
    getRoomByNumber,
    addRoom,
    deleteRoom,
    getStatistics,
    updateRoomInfo,
    addEmployee,
    removeEmployee,
    getEmployeeByID,
    checkInUser,
    checkOutUser,
    getCheckedInEmployees,
    getCheckedOutEmployees
}


/// --- ROOM FUNCTIONS --- ///

async function getAllRooms(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find().sort({roomNumber: 1}).toArray()
        client.close()
        return rooms
    } catch(err){
        throw err
    }
}

async function getRoomByNumber(roomNumber){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const room = await db.collection('rooms').findOne({roomNumber: roomNumber})
        client.close()
        return room
    } catch (err){
        throw err
    }
}

async function getAvailableRooms(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find({availableBeds: { $gt: 0}}).sort({roomNumber: 1}).toArray()
        client.close()
        return rooms
    } catch(err){
        throw err
    }
}


async function addRoom(roomNum, extension, beds){
    try{
        let numBeds = Number.parseInt(beds)
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('rooms').insertOne({roomNumber: roomNum, extension: extension, beds: numBeds, availableBeds: numBeds, occupants: [] })
        client.close()
        return
    } catch(err){
        throw err
    }
}

async function getStatistics(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const result = await db.collection('users').aggregate([
            {
              "$group" : {
                _id: '$category',
                count: { $sum: 1 }
              }
            }
        ]).toArray()
        client.close()
        return result
    } catch(err){
        throw err
    }
}


//add more error handling to remove users in room and set their checkedIn to false
async function deleteRoom(roomNumber){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('rooms').deleteOne({roomNumber: roomNumber})
        client.close()
        return
    } catch(err){
        throw err
    }
}

async function updateRoomInfo(roomNum, roomNumber, extension, beds){
    try{
        let numBeds = Number.parseInt(beds)
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('rooms').updateOne(
            {roomNumber: roomNum},
            {$set: {roomNumber: roomNumber, extension: extension, beds: numBeds, availableBeds: numBeds}}
        )
    } catch(err){
        throw err
    }
}


/// --- EMPLOYEE FUNCTIONS --- ///

async function getAllEmployees(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employees = await db.collection('users').find().sort({lastname: 1, firstname: 1}).toArray()
        client.close()
        return employees
    } catch(err){
        throw err
    }
}

async function getEmployeeByID(shellID){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employee = await db.collection('users').findOne({shellID: shellID})
        client.close()
        return employee
    } catch(err){
        throw err
    }
}

async function addEmployee(lastname, firstname, shellID, category, gender, department){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('users').insertOne({
            lastname: lastname, firstname: firstname, shellID: shellID, 
            category: category, gender: gender, department: department, 
            checkedIn: false
        })
        client.close()
        return
    } catch(err){
        throw err
    }
}

async function removeEmployee(shellID){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employee = await getEmployeeByID(shellID)
        if(employee.checkedIn){
            await db.collection('rooms').updateOne(
                { occupants: { $elemMatch: { shellID: shellID } } },
                {
                    $pull: { occupants: { shellID: shellID } }, 
                    $inc: { availableBeds: 1 }
                },
            );
        }
        await db.collection('users').deleteOne({shellID: shellID})
        client.close()
        return
    } catch(err){
        throw err
    }
}


/// --- RESERVATION FUNCTIONS --- ///

async function checkInUser(shellID, checkInDate, checkOutDate, roomNumber){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const newOccupant = {
            shellID: shellID, checkInDate: checkInDate, checkOutDate: checkOutDate
        }
        await db.collection('rooms').updateOne(
            { roomNumber: roomNumber }, 
            { 
                $push: {occupants: newOccupant },
                $inc: {availableBeds: -1}
            }
        )
        await db.collection('users').updateOne(
            {shellID: shellID},
            {
                $set: {checkedIn: true}
            }
        )
        client.close()
        return
    } catch(err){
        throw err
    }
}

async function checkOutUser(shellID){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('rooms').updateOne(
            { occupants: { $elemMatch: { shellID: shellID } } },
            {
                $pull: { occupants: { shellID: shellID } }, 
                $inc: { availableBeds: 1 }
            },
        );
        await db.collection('users').updateOne(
            {shellID: shellID},
            {
                $set: {checkedIn: false}
            }
        )
    } catch(err){
        throw err
    }
}

async function getCheckedInEmployees(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employees = await db.collection('users').find({checkedIn: true}).sort({lastname: 1, firstname: 1}).toArray()
        client.close()
        return employees
    } catch(err){
        throw err
    }
}

async function getCheckedOutEmployees(){
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employees = await db.collection('users').find({checkedIn: false}).sort({lastname: 1, firstname: 1}).toArray()
        client.close()
        return employees
    } catch(err){
        throw err
    }
}