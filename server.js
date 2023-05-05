const express = require('express')
const app = express()
const bodyParser = require('body-parser')



const mc = require('mongodb').MongoClient

const { MONGODB } = require('./config.js')


app.use(express.static('public'));
app.set("view engine", "ejs")
app.set("view engine", "pug")
app.use('/views', express.static("views"))
app.use('/css', express.static("css"))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (request, response)=>{
    response.render("index.pug")
})


app.get('/add-user', (request, response)=>{
    response.render('adduser.pug')
})


app.post('/add-user', async (request, response)=>{
    const {lastname, firstname, shellID, category, gender, department} = request.body
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('users').insertOne({
            lastname: lastname, firstname: firstname, shellID: shellID, category: category, gender: gender, department: department, checkedIn: false
        })
        client.close()
        response.redirect('/')
    } catch(err){
        throw err
    }
})

app.get('/all-users', async (request, response)=>{
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employees = await db.collection('users').find().toArray()
        response.render('users.pug', {employees: employees})
        client.close()
    } catch(err){
        throw err
    }
})


app.get('/all-rooms', async (request, response)=>{
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find().toArray()
        response.render('rooms', {rooms: rooms})
        client.close()
    }catch (err){
        throw err
    }
})


app.get('/available-rooms', async (request, response)=>{
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find({availableBeds: { $gt: 0}}).toArray()
        response.render('availableRooms', {rooms: rooms})
        client.close()
    }catch (err){
        throw err
    }
})


app.get('/rooms/:id', async (request, response)=>{
    console.log(request.params.id)
    try{
        let roomNumber = request.params.id
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const room = await db.collection('rooms').findOne({roomNumber: roomNumber})
        response.end()
    } catch(err){
        throw err
    }
})




app.get('/add-room', (request, response)=>{
    response.render('addroom.pug')
})



app.post('/add-room', async (request, response)=>{
    try {
        const {roomNum, extension} = request.body
        let beds = Number.parseInt(request.body.beds)
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        await db.collection('rooms').insertOne({roomNumber: roomNum, extension: extension, beds: beds, availableBeds: beds, occupants: []})   
        client.close();
        response.redirect('/')
    } catch (err) {
        throw err
    }
})



app.get('/check-in', async (request, response)=>{
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const availableRooms = await db.collection('rooms').find({availableBeds: { $gt: 0}}).toArray()
        const employees = await db.collection('users').find({checkedIn: false}).sort({lastname: 1, firstname: 1}).toArray()
        response.render('checkin.pug', {employees: employees, rooms: availableRooms})
        client.close()
    } catch(err){
        throw err
    }
})


app.post('/check-in', async (request, response)=>{
    const {shellID, checkInDate, checkOutDate, roomNumber} = request.body
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
        response.redirect('/')
    } catch(err){
        throw err
    }
})


app.get('/check-out', async (request, response)=>{
    try{
        const client = await mc.connect(MONGODB)
        let db = client.db('reservation')
        const employees = await db.collection('users').find({checkedIn: true}).toArray()
        response.render('checkout.pug', {employees: employees})
        client.close()
    }catch(err){
        throw err
    }
})


app.post('/check-out', async (request, response)=>{
    const {shellID} = request.body
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
        response.redirect('/')
    } catch(err){
        throw err
    }
})


app.listen(3000, ()=>{
    console.log("listening on port 3000")
})