const mongoose = require("mongoose")

const patientSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registeredDate: { type: String },            // note down the date registered
    role: { type: String, default: "patient" },
    image:String
})

const PatientModel = mongoose.model("patient", patientSchema)

module.exports = {
    PatientModel
}