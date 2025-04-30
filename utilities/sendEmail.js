const { error } = require("@hapi/joi/lib/base");
const nodemailer = require("nodemailer")
async function sendEmail (email, subject, html){
    try {
          const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
          },
        });
        
        const mailOptions = {
          from: process.env.BREVO_EMAIL,
          to: email,
          subject: subject,
          text: html.replace(/<[^>]+>/g, ""),
          html: html,
        };
        const info = await transporter.sendMail(mailOptions, (error, info)=>{
        });
        return true;
      } catch (error) {
        console.error("Failed to send email:", error);
        return false;
      }
}
module.exports = sendEmail