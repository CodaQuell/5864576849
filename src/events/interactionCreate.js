// Import the Interaction class from discord.js
const { Interaction } = require("discord.js");

// Export an object with a name and an execute function
module.exports = {
 name: "interactionCreate", // Name of the event listener
 async execute(interaction, client) {
    // Check if the interaction is a command
    if (!interaction.isCommand()) return;

    // Retrieve the command from the client's command collection using the command name
    const command = client.commands.get(interaction.commandName);

    // If the command does not exist, exit the function
    if (!command) return;

    try {
      // Attempt to execute the command with the interaction and client as arguments
      await command.execute(interaction, client);
    } catch (error) {
      // Log the error to the console
      console.log(error);
      // Reply to the interaction with an error message
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true, // The reply is only visible to the user who triggered the interaction
      });
    }
 },
};

