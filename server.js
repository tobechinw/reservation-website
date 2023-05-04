const express = require('express')
const app = express()
const bodyParser = require('body-parser')



const mc = require('mongodb').MongoClient
const uri = "mongodb+srv://tobechinwachukwu:yAyB0vU5TYOFhrHa@cluster0.sbwko.mongodb.net/?retryWrites=true&w=majority";


app.use(express.static('public'));
app.set("view engine", "ejs")
app.use('/views', express.static("views"))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (request, response)=>{
    response.render("index")
    response.end()
})


app.get('/all-rooms', async (request, response)=>{
    try{
        const client = await mc.connect(uri)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find().toArray()

        console.log(rooms)
        response.end()
        client.close()

    }catch (err){
        throw err
    }
})


app.get('/available-rooms', async (request, response)=>{
    try{
        const client = await mc.connect(uri)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find({isOccupied: false}).toArray()
        console.log(rooms)
        response.end()
        client.close()

    }catch (err){
        throw err
    }
})


app.get('/add-room', (request, response)=>{
    response.render('addroom')
    response.end()
})

app.post('/add-room', async (request, response)=>{
    console.log(request.body)
    let name = request.body.name
    let message = request.body.message
    try {
        const client = await mc.connect(uri)
        console.log('successful connection')
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find().toArray()
        let roomNumber = rooms.length + 1
        await db.collection('rooms').insertOne({name: name, message: message, roomNumber: roomNumber, isOccupied: false, occupant: '', category: '', department: ''})
        console.log('successful')
        client.close();
        response.redirect('/')
    } catch (err) {
        throw err
    }
})



app.get('/rooms/:id', async (request, response)=>{
    console.log(request.params.id)
    try{
        let roomNumber = request.params.id
        const client = await mc.connect(uri)
        let db = client.db('reservation')
        const room = await db.collection('rooms').findOne({roomNumber: roomNumber})
        console.log(room)
        response.end()
    } catch(err){
        throw err
    }
})


app.get('/check-in', (request, response)=>{
    response.render('checkin')
})


app.post('/check-in', async (request, response)=>{
    console.log(request.body)
    let name = request.body.name
    let category = request.body.category
    let department = request.body.category
    try{
        const client = await mc.connect(uri)
        let db = client.db('reservation')
        const rooms = await db.collection('rooms').find({isOccupied: false}).toArray()
        if(rooms.length > 0){
            await db.collection("rooms").updateOne({isOccupied: false}, {$set: {isOccupied: true, occupant: name, category: category, department: department}})
            response.redirect('/')
        }else{
            //cannot check in because there aren't enough rooms
            response.redirect('/')
        }
    } catch (err){
        throw err
    }
})


app.get('/check-out', (request, response)=>{
    response.render('checkout')
})


app.post('/check-out', async (request, response)=>{
    let occupant = request.body.name
    console.log(occupant)
    try{
        const client = await mc.connect(uri)
        let db = client.db('reservation')
        await db.collection('rooms').updateOne({occupant: occupant}, {$set: {occupant: '', isOccupied: false, category: '', department: ''}})
        response.redirect('/')
    } catch(err){
        throw err
    }
})


app.listen(3000, ()=>{
    console.log("listening on port 3000")
})