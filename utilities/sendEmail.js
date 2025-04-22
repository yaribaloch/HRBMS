const nodemailer = require("nodemailer")
async function sendEmail (email, subject, html){
try{    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth:{
            user: process.env.BREVO_EMAIL_ADDRESS,
            pass: process.env.BREVO_EMAIL_PASS
        }
    })
    const emailBody = {
    from : process.env.BREVO_EMAIL_ADDRESS,
    to: email,
    subject: subject,
    text: html.replace(/<[^>]+>/g, ""),
    html: html
    }
    const info = await transporter.sendMail(emailBody);
    console.log("Message sent: "+info.messagId);
    return true
}
catch(error){
    console.log("Folloeing error occurred: "+error);
    return false
}
}
module.exports = sendEmail