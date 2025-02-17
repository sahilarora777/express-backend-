const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { text } = require('stream/consumers');

//function for otp generate 

const generatedOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
}


const sendEmail = async (email ,otp) => {
        const transporter = nodemailer.createTransport({    
          service: "gmail",
            auth: {
                user: process.env.Email_USER,
                pass: process.env.Email_PASS
            }

        })
    

    const mailOptions = {
        from: 'process.env.Email_USER', 
        to: email,
        subject: 'OTP for registration',
        text: `Your Otp for email Veriication is: ${otp}.This is valid for 10 minutes`
    }
    await transporter.sendMail(mailOptions);
}

module.exports = { generatedOTP, sendEmail };