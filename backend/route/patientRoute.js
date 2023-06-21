const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const patientRoute = express.Router();
patientRoute.use(express.json());
const moment = require("moment");
const fs = require("fs")

require("dotenv").config();

const { client } = require("../config/db")
const { PatientModel } = require("../model/PatientModel");

const { authorise } = require("../authorize")


// to register patient and then hashing password using Bcrypt
patientRoute.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body
    const patientFound = await PatientModel.findOne({ email })
    if (patientFound) {
        res.status(409)({ "message": "Already patient registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new PatientModel({ name, email, password: hash, registeredDate: dateFormat, role })
                await data.save()
                res.status(201).send({ "message": "patient registered" })
            });
        }
        catch (err) {
            res.status(500)({ "ERROR": err })
        }
    }
})

// to let patient login and then create and send token as response
patientRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await PatientModel.findOne({ email })
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ patientID: data._id }, process.env.key, { expiresIn: 60 * 30 });
                var refreshtoken = jwt.sign({ patientID: data._id }, process.env.key, { expiresIn: 60 * 90 });
                res.status(201).send({ "message": "Validation done", "token": token, "refresh": refreshtoken })
            }
            else {
                res.status(401).send({ "message": "INVALID credentials" })
            }
        });
    }
    catch (err) {
        res.status(500)({ "ERROR": err })
    }
})


patientRoute.patch("/update/:id", async (req, res) => {
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

patientRoute.delete("/delete/:id", async (req, res) => {
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


// implementing logout using redis
patientRoute.post("/logout", async (req, res) => {
    const token = req.headers.authorization
    if (token) {
        // <------------ REDIS usage
        await client.sadd("keyname", token)
        res.send({ "message": "Logout done successfully" })
    }
    else {
        res.send({ "message": "Please login" })
    }
})

module.exports = {
    patientRoute
}