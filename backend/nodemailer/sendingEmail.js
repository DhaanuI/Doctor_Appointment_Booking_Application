const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (data) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'dhaanu97@gmail.com',
            pass: process.env.GOOGLEKEY
        }
    });

    transporter.sendMail({
        to: `${data.email}`,
        from: 'dhaanu97@gmail.com',
        subject: `${data.subject}`,
        html: `${data.body}`,
    })
        .then(() => console.log('mail sent successfully'))
        .catch((err) => console.log("err", err))

}

module.exports = { sendEmail }
