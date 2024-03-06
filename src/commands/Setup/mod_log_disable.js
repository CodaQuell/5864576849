// Importing necessary modules from discord.js and a custom schema for mod log
const {
  PermissionsBitField, // Enum for permission flags
  SlashCommandBuilder, // Used to build slash commands
  EmbedBuilder, // Used to create rich embed messages
 } = require("discord.js");
 const Modlog = require("../../Schemas/mod_log_schema"); // Custom schema for mod log
 
 // Exporting a module with a slash command and its execution logic
 module.exports = {
  data: new SlashCommandBuilder() // Building a slash command
     .setName("modlog-disable") // Command name
     .setDescription("Disables the mod log channel for this server."), // Command description
  async execute(interaction) { // Function to execute when the command is used
     const guildId = interaction.guild.id; // Getting the guild ID
 
     // Creating an embed message for error handling
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Error") // Setting the title of the embed
       .setDescription(
         `You don't have permission to disable the moderation logging channel in this server`
       ) // Setting the description of the embed
       .setTimestamp() // Adding a timestamp to the embed
       .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed
 
     // Checking if the user has the Administrator permission
     if (
       !interaction.member.permissions.has(
         PermissionsBitField.Flags.Administrator
       )
     )
       // If the user does not have the permission, reply with the error embed
       return await interaction.reply({ embeds: [perm], ephemeral: true });
 
     try {
       // Finding the mod log entry for the guild
       const modlog = await Modlog.findOne({ guildId });
       if (!modlog) {
         // If no mod log entry is found, inform the user
         return interaction.reply({
           content: "Mod log channel has not been set up yet.",
           ephemeral: true,
         });
       }
 
       // Deleting the mod log entry for the guild
       await Modlog.findOneAndDelete({ guildId });
 
       // Replying to the interaction with a success embed
       return interaction.reply({
         embeds: [
           new EmbedBuilder()
             .setTitle("ModLogs Disabled") // Setting the title of the embed
             .setDescription(
               `Your Mod Log channel has been disabled. \n To turn on this feature run the command \`/modlog-setup\``
             ) // Setting the description of the embed
             .setColor("DarkButNotBlack") // Setting the color of the embed
             .setTimestamp() // Adding a timestamp to the embed
             .setFooter({ text: `${process.env.serverName}` }), // Setting the footer of the embed
         ],
       });
     } catch (error) {
       // Logging any errors that occur
       console.error(error);
       // Informing the user of the error
       return interaction.reply({
         content: "An error occurred while disabling the mod log channel",
         ephemeral: true,
       });
     }
  },
 };
 