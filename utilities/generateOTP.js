const otpGenerator = require("otp-generator")

function generateOTP(){
return otpGenerator.generate(6, {lowerCaseAlphabets: false})

}
module.exports = generateOTP