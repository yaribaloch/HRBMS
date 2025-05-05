const { initializeApp } = require("firebase/app");
const  { getMessaging } =require("firebase/messaging");
const firebaseConfig = {
    apiKey: "AIzaSyDh64BA6IzQS64xyLV19bOMbjwJ9MuQ1rg",
    authDomain: "hrbms-d40ce.firebaseapp.com",
    projectId: "hrbms-d40ce",
    storageBucket: "hrbms-d40ce.firebasestorage.app",
    messagingSenderId: "756436309938",
    appId: "1:756436309938:web:2c4f3e484f4ec8723cf6ab",
    measurementId: "G-S01EE47LBD"
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app)
  module.exports = {app, messaging}