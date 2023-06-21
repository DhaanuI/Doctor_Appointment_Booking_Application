const jwt = require("jsonwebtoken")

require("dotenv").config();


// authentication done here with the help of JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {

        let decoded = jwt.verify(token, process.env.key);
        if (decoded) {
            req.body.userID = decoded.userID.toString();
            next()
        }
        else {
            res.status(401).send({ "message": "Oops, You're NOT Authorized" });
        }
    }
    else {
        res.status(401).send({ "message": "Please login again" })
    }
}

module.exports = {
    authenticate
}


