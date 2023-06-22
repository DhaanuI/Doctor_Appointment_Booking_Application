const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doctorRoute = express.Router();
doctorRoute.use(express.json());
const moment = require("moment");
const fs = require("fs")

require("dotenv").config();

const { authorise } = require("../authorize")
const { client } = require("../config/db")
const { DoctorModel } = require("../model/DoctorModel");


// to register doctor and then hashing password using Bcrypt
doctorRoute.post("/register", async (req, res) => {
    const { name, email, password, role, specialization, image } = req.body
    const doctorFound = await DoctorModel.findOne({ email })
    if (doctorFound) {
        res.status(409)({ "message": "Already doctor registered" })
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new DoctorModel({ name, email, password: hash, image, registeredDate: dateFormat, role, specialization })
                await data.save()
                res.status(201).send({ "message": "doctor registered" })
            });
        }
        catch (err) {
            res.status(500)({ "ERROR": err })
        }
    }
})

// to let doctor login and then create and send token as response
doctorRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    let data = await DoctorModel.findOne({ email })
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ doctorID: data._id }, process.env.key, { expiresIn: 60 * 30 });
                var refreshtoken = jwt.sign({ doctorID: data._id }, process.env.key, { expiresIn: 60 * 90 });
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


doctorRoute.patch("/update/:id", async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await DoctorModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Database modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})

doctorRoute.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;

    try {
        await DoctorModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Particular data has been deleted" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})

doctorRoute.get("/all", async (req, res) => {
    try {
        let data = await DoctorModel.find()
        res.status(200).send({ "Doctors": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})


// implementing logout using redis
doctorRoute.post("/logout", async (req, res) => {
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
    doctorRoute
}