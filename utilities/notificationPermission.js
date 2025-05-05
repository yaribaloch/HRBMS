const {messaging} = require("../firebase-messaging-sw")
async function requestNotificationPermission() {
    const permission = Notification.requestPermission()
    if(permission === "granted"){

    }
    else if(permission=== "denied"){
        alert("You denied Notification permission.")
}
}
module.exports = {requestNotificationPermission}