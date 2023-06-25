const express = require("express");
require("dotenv").config();

const { AppointmentModel } = require("../model/AppointmentModel");
const { authenticate } = require("../middleware/authentication.middleware")

const appointmentRoute = express.Router();
appointmentRoute.use(express.json());
appointmentRoute.use(authenticate);


appointmentRoute.get("/", async (req, res) => {
    try {
        let data = await AppointmentModel.find().populate("patientId doctorId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(404).send({ "ERROR": err })
    }
})

appointmentRoute.get("/docapp/:id", async (req, res) => {
    const ID = req.params.id;
    try {
        let data = await AppointmentModel.find({ doctorId: ID }).populate("doctorId patientId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})


appointmentRoute.get("/patapp/:id", async (req, res) => {
    const ID = req.params.id;
    try {
        let data = await AppointmentModel.find({ patientId: ID }).populate("doctorId patientId")
        res.status(200).send({ "Appointments": data })
    }
    catch (err) {
        res.status(500).send({ "ERROR": err })
    }
})


appointmentRoute.post("/add", async (req, res) => {
    const { doctorId, date, startTime, endTime, patientId } = req.body;
    try {
        const isSlotBooked = await AppointmentModel.exists({
            doctorId,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (isSlotBooked) {
            return res.status(409).send({ error: 'Time slot not available. Please choose a different time.' });
        }

        const appointment = new AppointmentModel({
            doctorId,
            patientId,
            date,
            startTime,
            endTime
        });

        await appointment.save();
        res.send({ "message": 'Appointment booked successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ "error": 'An error occurred while booking the appointment' });
    }
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