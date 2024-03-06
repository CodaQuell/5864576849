// Importing necessary modules from discord.js and quick.db
const {
  EmbedBuilder, // Used to create rich embed messages
  PermissionsBitField, // Enum for permission flags
  SlashCommandBuilder, // Used to build slash commands
 } = require("discord.js");
 const { QuickDB } = require("quick.db"); // QuickDB for easy database management
 const db = new QuickDB(); // Instance of QuickDB
 
 // Exporting a module with a slash command and its execution logic
 module.exports = {
  data: new SlashCommandBuilder() // Building a slash command
     .setName("welcome-disable") // Command name
     .setDescription("disables the welcome channel"), // Command description
  async execute(interaction) { // Function to execute when the command is used
     // Creating an embed message for error handling
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Error") // Setting the title of the embed
       .setDescription(
         `You don't have permission to disable the welcome channel in this server members in this server`
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
 
     // Assuming the command has a channel option, but it's not defined in the provided code
     // const channel = interaction.options.getChannel("channel");
 
     // Creating an embed message for successful operation
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Welcome Channel Disabled") // Setting the title of the embed
       .setDescription(
         `Your welcome channel has been disabled. \n To turn on this feature run the command \`/welchannel-setup\``
       ) // Setting the description of the embed
       .setTimestamp() // Adding a timestamp to the embed
       .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed
 
     // Deleting the welcome channel setting from the database
     await db.delete(`wel_channel${interaction.guild.id}`);
 
     // Replying to the interaction with the success embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 