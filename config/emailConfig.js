const nodemailer = require('nodemailer');
require('dotenv').config();

// create a transport 

const transporter = nodemailer.createTransport({

    //gmail,yahoo,outlook
    service : "gmail", 

    auth:{
        user : process.env.Email_USER,
        pass: process.env.Email_PASS
        }

});

//function for mailing 

// mail options = description , subject, to, from   

const sendEmail = async (mailOptions) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully", response: info.response };
    } catch (err) {
        return { success: false, message: "Error sending email", error: err.message || err };
    }
};

module.exports = { sendEmail };