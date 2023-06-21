const express = require("express");
require("dotenv").config();

const { AppointmentModel } = require("../model/AppointmentModel");
const { authenticate } = require("../middleware/authentication.middleware")

const appointmentRoute = express.Router();
appointmentRoute.use(express.json());
appointmentRoute.use(authenticate);

appointmentRoute.get("/", async (req, res) => {

})


appointmentRoute.post("/add", async (req, res) => {

})


appointmentRoute.patch("/update/:id", async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    try {
        await AppointmentModel.findByIdAndUpdate({ _id: ID }, payload)
        res.send({ "message": "Appointment modified" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})


appointmentRoute.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;

    try {
        await AppointmentModel.findByIdAndDelete({ _id: ID })
        res.send({ "message": "Particular Appointment has been deleted" })
    }
    catch (err) {
        console.log(err)
        res.send({ "message": "error" })
    }
})


module.exports = {
    appointmentRoute
}