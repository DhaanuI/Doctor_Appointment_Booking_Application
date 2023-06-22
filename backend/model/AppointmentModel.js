const mongoose = require("mongoose")

const { DoctorModel } = require("./DoctorModel");
const { PatientModel } = require("./PatientModel");


const appointmentSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: DoctorModel },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: PatientModel },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});


const AppointmentModel = mongoose.model("appointment", appointmentSchema)

module.exports = {
    AppointmentModel
}