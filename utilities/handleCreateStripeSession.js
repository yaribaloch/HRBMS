const stripe = require("@stripe/stripe-js")
async function handleCreateStripeSession(req, res) {
    const booking = req.body;
    console.log("Booking: "+booking);
    
    const line_items = [{
        price_data:{
            currency: "usd",
            product_data:{
                name: "Room Booking",
                booking_id: booking._id
            },
            unit_amount: booking.bookingPrice
        },
        quantity: 1
    }]

    const session = await stripe(process.env.STRIPE_SECRET).checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        success_url:"",
        cancel_url:""
    })

    res.json({id: session.id})

}
module.exports = handleCreateStripeSession