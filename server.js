const express = require('express')
const app = express()
const bodyParser = require('body-parser')



const { MongoClient, ServerApiVersion } = require('mongodb');

const mc = require('mongodb').MongoClient
const uri = "mongodb+srv://tobechinwachukwu:yAyB0vU5TYOFhrHa@cluster0.sbwko.mongodb.net/?retryWrites=true&w=majority";


app.use(express.static('public'))
app.set("view engine", "ejs")
app.use('/views', express.static("views"))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));


var numRooms = 0

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
    numRooms++
    console.log(numRooms)
    let name = request.body.name
    let message = request.body.message
    try {
        const client = await mc.connect(uri);
        console.log('successful connection')
        let db = client.db('reservation')
        await db.collection('rooms').insertOne({name: name, message: message, roomNumber: numRooms, isOccupied: false})
        console.log('successful')
        client.close();
        response.redirect('/')
    } catch (err) {
        console.log(err);
        response.status(500).send(err.message);
    }
})



app.get('/rooms/:id', (request, response)=>{
    console.log(request.params.id)
})


app.get('/check-in', (request, response)=>{
    response.write('checking in rooms...')
    response.end()
})

app.post('/check-in', (request, response)=>{
    console.log(request)
})



app.get('/check-out', (request, response)=>{
    response.write('checking out of rooms...')
    response.end()
})


app.post('/check-out', (request, response)=>{
    console.log(request.body)
})



app.listen(3000, ()=>{
    console.log("listening on port 3000")
})