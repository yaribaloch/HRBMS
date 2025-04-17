const Booking = require("../models/booking");
async function findMinAndMaxDate(property, check){
    let max = new Date("1999-01-01");
    let min = new Date("2100-01-01");
    const data = await Booking.find({});
    
    data.forEach(element => {
        if(check=="max"){
            if(element[property]>max) {
            max=element[property];
            }
        if(check=="min"){
            if(element[property]<min) {
            max=element[property];
            }
        }
}});
if(check=="max"){
    return max;
} else return min;
}
module.exports = findMinAndMaxDate;