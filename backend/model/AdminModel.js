const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registeredDate: { type: String },            // note down the date registered
    role: { type: String, default: "admin" },
    image: String
})

const AdminModel = mongoose.model("admin", adminSchema)

module.exports = {
    AdminModel
}