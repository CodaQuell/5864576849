// Import the ActivityType class from discord.js and mongoose for MongoDB operations
const { ActivityType } = require('discord.js');
const mongoose = require("mongoose");
// Retrieve the MongoDB connection URL from environment variables
const MONGODBURL = process.env.mongoURL;

// Export an object with a name, a flag indicating it should only be executed once, and an execute function
module.exports = {
 name: "ready", // Name of the event listener
 once: true, // Indicates this event should only be handled once
 async execute(client) {

    // If the MongoDB URL is not set, exit the function
    if (!MONGODBURL) return;

    // Set mongoose to use strict query mode
    mongoose.set('strictQuery', true);

    // Attempt to connect to the MongoDB database using the provided URL
    await mongoose.connect(MONGODBURL || '', {
        keepAlive: true, // Keep the connection alive
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true // Use the new server discovery and monitoring engine
    });

    // Log the bot's username and ID, and the token and ID from environment variables
    console.log(`Logged in as ${client.user.tag}`)
    console.log(`${client.user.tag} (${client.user}) is online.`);
    console.log(`Token: ${process.env.token}`)
    console.log(`ID: ${process.env.id}`)
    console.log(" ")

    // Set the bot's presence to show it's listening to "/help | /rank"
    await client.user.setPresence({ 
      activities: [{ name: "/help | /rank", type: ActivityType.Listening}],
      status: "online" // Set the bot's status to online
    });

    console.log("Connecting to MongoDB Database.")

    // Check if mongoose is connected to the database
    if (mongoose.connection.readyState === 1) { // 1 indicates a connected state
      console.log("Connected to MongoDB Database.");
      console.log(" ")
      
    } else {
      console.log("Did not connect to MongoDB DataBase.");
    }
 },
};
