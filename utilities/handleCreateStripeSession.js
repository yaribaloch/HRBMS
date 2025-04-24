const { description } = require("@hapi/joi/lib/base");
const axios = require("axios")

const stripe = require("stripe")(process.env.STRIPE_SECRET)
async function handleCreateStripeSession(res, newBooking) {
    const booking = newBooking;

    
    const line_items = [{
        price_data:{
            currency: "usd",
            product_data:{
                name: "Room Booking",
                description: `Booking is starting from ${booking.bookingStartDate} to ${booking.bookingEndDate}`
            },
            unit_amount: booking.bookingPrice
        },
        quantity: 1
    }]

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        metadata: {booking: JSON.stringify(booking)},
        mode: "payment",
        success_url:"http://localhost:3000/stripe/bookingpaymentsuccess?session_id={CHECKOUT_SESSION_ID}",
        cancel_url:"http://localhost:3000/stripe/bookingpaymentcancel"
    })

    if(!session) 
        return res.status(400).json({
        status: false,
        message: "Could not create Stripe payment session.",
    })
    //const session = response.data

    const sessionRetrieve = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${session.id}`, {
        auth: {
            username: process.env.STRIPE_SECRET,
            password:''
        }
    })
    if(!sessionRetrieve) return res.status(400).json({
        status: false,
        message: "Could get Stripe payment session.",
    })

    return res.status(200).json({
        status: true,
        message: "Stripe payment session created.",
        sessionData: sessionRetrieve.data
    })

}
module.exports = handleCreateStripeSession