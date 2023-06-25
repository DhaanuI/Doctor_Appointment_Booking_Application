const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const patientRoute = express.Router();
patientRoute.use(express.json());
const moment = require("moment");
const fs = require("fs")

require("dotenv").config();

const { PatientModel } = require("../model/PatientModel");

const { authorise } = require("../authorize")


// to register patient and then hashing password using Bcrypt
patientRoute.post("/register", async (req, res) => {
    const { name, email, password, role, image } = req.body
    const patientFound = await PatientModel.findOne({ email })
    if (patientFound) {
        res.status(409).send({ "message": "Already patient registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new PatientModel({ name, email, password: hash, image, registeredDate: dateFormat, role })
                await data.save()
                res.status(201).send({ "message": "Patient Registered" })
            });
        }
        catch (err) {
            res.status(500).send({ "ERROR": err })
        }
    }
})


// to let patient login and then create and send token as response
patientRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await PatientModel.findOne({ email })
    if (!data) {
        return res.send({ "message": "No user found" })
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ patientID: data._id }, process.env.key);
                var refreshtoken = jwt.sign({ patientID: data._id }, process.env.key, { expiresIn: 60 * 1000 });
                res.status(201).send({
                    "message": "Validation done",
                    "token": token,
                    "refresh": refreshtoken,
                    "name": data.name,
                    "id": data._id
                })
            }
            else {
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})

// implementation of Role based authorization - either Patient or Admin can only modify changes in their information
patientRoute.patch("/update/:id", authorise(["patient", "admin"]), async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await PatientModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})


// implementation of Role based authorization - either Patient or Admin can only modify changes in their information
patientRoute.delete("/delete/:id", authorise(["patient", "admin"]), async (req, res) => {
    const ID = req.params.id;
    try {
        await PatientModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Particular data has been deleted" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})



patientRoute.get("/all", async (req, res) => {
    try {
        let data = await PatientModel.find()
        res.status(200).send({ "Patients": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})


patientRoute.post("/logout", async (req, res) => {
    const token = req.headers.authorization
    if (token) {
        const blacklistedData = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
        blacklistedData.push(token)

        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistedData))
        res.send({ "message": "Logout done successfully" })
    }
    else {
        res.send({ "message": "Please login" })
    }
})


module.exports = {
    patientRoute
}