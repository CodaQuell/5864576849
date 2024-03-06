// Import necessary classes from discord.js
const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  messageLink,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("purge") // Set the command name
     .setDescription(
       "Deletes the specified number of messages (cannot delete messages from 14 or more days ago)"
     ) // Set the command description
     .addIntegerOption((option) => // Add an integer option for the amount of messages to delete
       option
         .setName("amount") // Set the option name
         .setDescription("The amount of messages to delete") // Set the option description
         .setMinValue(1) // Set the minimum value for the option
         .setMaxValue(100) // Set the maximum value for the option
         .setRequired(true) // Make the option required
     ),
  async execute(interaction, client) {
     // Get the amount of messages to delete from the command options
     const amount = interaction.options.getInteger("amount");
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to purge messages in this server`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Check if the user has administrator permissions
     if (
       !interaction.member.permissions.has(
         PermissionsBitField.Flags.Administrator
       )
     )
       // If not, reply with the error embed and return
       return await interaction.reply({ embeds: [perm], ephemeral: true });
 
     // Check if the amount is specified and within the allowed range
     if (!amount)
       return await interaction.reply({
         content:
           "Please specify the amount of messages you would like to purge.",
         ephemeral: true,
       });
     if (amount > 100 || amount < 1)
       return await interaction.reply({
         content: "Please choose a number between 1-100.",
         ephemeral: true,
       });
 
     // Attempt to delete the specified number of messages
     await interaction.channel.bulkDelete(amount).catch((err) => {
       return;
     });
     // Reply to the interaction with a confirmation message
     await interaction.reply({
       content: `Deleted **${amount}** messages.`,
       ephemeral: true,
     });
  },
 };
 