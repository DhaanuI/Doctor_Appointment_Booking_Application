const jwt = require("jsonwebtoken")
const fs = require("fs")
require("dotenv").config();


// authentication done here with the help of JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const blacklistedData = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))

        if (blacklistedData.includes(token)) {
            res.send({"message":"Please login again"})
        }
        else {
            let decoded = jwt.verify(token, process.env.key);
            if (decoded) {

                req.body.userID = decoded.patientID || decoded.doctorID
                next()
            }
            else {
                res.status(401).send({ "message": "Oops, You're NOT Authorized" });
            }
        }
    }
    else {
        res.status(401).send({ "message": "Please login again" })
    }
}

module.exports = {
    authenticate
}


