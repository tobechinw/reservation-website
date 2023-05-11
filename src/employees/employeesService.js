const jwt = require('jsonwebtoken')


const mc = require('mongodb').MongoClient

const {MONGODB} = require('../config')

const mongo = require('../db/mongodb')



module.exports = {
    getAll,
    addEmployee,
    removeEmployee
}

async function getAll(){

    const users = await mongo.getAllEmployees()
    return users
    // try{
    //     const client = await mc.connect(MONGODB)
    //     let db = client.db('reservation')
    //     const users = db.collection('users').find().sort({lastname: 1, firstname: 1}).toArray()
    //     client.close()
    //     return users
    // } catch(err){
    //     throw err
    // }
}

async function addEmployee({lastname, firstname, shellID, category, gender, department}){
    await mongo.addEmployee(lastname, firstname, shellID, category, gender, department)
    return
    
    // try{
    //     const client = await mc.connect(MONGODB)
    //     let db = client.db('reservation')
    //     await db.collection('users').insertOne({
    //         lastname: lastname, firstname: firstname, shellID: shellID, category: category, gender: gender, department: department, checkedIn: false
    //     })
    //     client.close()
    //     return;
    // } catch(err){
    //     throw err
    // }
}

async function removeEmployee({shellID}){

    await mongo.removeEmployee(shellID)
    return

    // try{
    //     const client = await mc.connect(MONGODB)
    //     let db = client.db('reservation')
    //     const user = await db.collection('users').findOne({shellID: shellID})
    //     if(user.checkedIn){
    //         await db.collection('rooms').updateOne(
    //             { occupants: { $elemMatch: { shellID: shellID } } },
    //             {
    //                 $pull: { occupants: { shellID: shellID } }, 
    //                 $inc: { availableBeds: 1 }
    //             },
    //         );
    //     }
    //     await db.collection('users').deleteOne({shellID: shellID})
    //     client.close()
    //     return;
    // }catch (err){
    //     throw err
    // }
}


