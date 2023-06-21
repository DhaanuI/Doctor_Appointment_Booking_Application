const express = require("express");

// dotenv to securely store values 
require("dotenv").config();
const cors = require("cors")
const app = express();
app.use(express.json());

app.use(cors())


// importing necessary things from other files
const { connection } = require("./config/db");
const { patientRoute } = require("./route/patientRoute");
const { doctorRoute } = require("./route/doctorRoute");
const { appointmentRoute } = require("./route/appointmentRoute");


// home route
app.get("/", async (req, res) => {
    res.status(200).send("Welcome to Hospital Management Backend");
})

// redirect routes
app.use("/patients", patientRoute)
app.use("/doctors", doctorRoute)
app.use("/appointments", appointmentRoute)


const server = require('http').Server(app)
const io = require('socket.io')(server)


io.on('connection', (socket) => {

})


server.listen(process.env.port, async (req, res) => {
    try {
        await connection;   // connecting to Database
        console.log("DB is connected")
    }
    catch (error) {
        console.log("DB is not connected", error)
    }
    console.log(`Listening at Port ${process.env.port}`)
})

