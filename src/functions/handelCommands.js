// Import necessary modules from discord.js and Node.js
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

// Retrieve the client ID from environment variables
const clientId = process.env.id;

// Export a function that takes a client object as an argument
module.exports = (client) => {
  // Define a method on the client object to handle commands
  client.handleCommands = async (commandFolders, path) => {
    // Initialize an array to store command data
    client.commandArray = [];
    // Loop through each folder in the commandFolders array
    for (folder of commandFolders) {
      // Read the directory of the current folder and filter for .js files
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((file) => file.endsWith(".js"));
      // Loop through each command file
      for (const file of commandFiles) {
        // Require the command file and store it in the command variable
        const command = require(`../commands/${folder}/${file}`);

      

        // Add the command to the client's commands collection
        client.commands.set(command.data.name, command);
        // Add the command data to the commandArray
        client.commandArray.push(command.data.toJSON());
      }
    }

    // Create a new REST instance for interacting with the Discord API
    const rest = new REST({
      version: "9",
    }).setToken(process.env.token);

    // Immediately invoked function expression (IIFE) to refresh application commands
    (async () => {
      try {
        console.log(" ");
        console.log("Started refreshing application (/) commands.");

        // Use the REST instance to update the application commands for the guild
        await rest.put(Routes.applicationCommands(clientId), {
          body: client.commandArray,
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        // Log any errors that occur during the command refresh process
        console.error(error);
      }

      console.log(" ");
    })();
  };
};
