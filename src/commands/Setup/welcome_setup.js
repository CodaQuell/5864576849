// Importing necessary modules from discord.js and quick.db
const {
  EmbedBuilder, // Used to create rich embed messages
  PermissionsBitField, // Enum for permission flags
  SlashCommandBuilder, // Used to build slash commands
  ChannelType, // Enum for channel types
 } = require("discord.js");
 const { QuickDB } = require("quick.db"); // QuickDB for easy database management
 const db = new QuickDB(); // Instance of QuickDB
 
 // Exporting a module with a slash command and its execution logic
 module.exports = {
  data: new SlashCommandBuilder() // Building a slash command
     .setName("welcome-setup") // Command name
     .addChannelOption((option) => // Adding a channel option to the command
       option
         .setName("channel") // Name of the option
         .setDescription("the channel you want your welcome messages sent to") // Description of the option
         .addChannelTypes(ChannelType.GuildText) // Restricting the option to text channels
         .setRequired(true) // Making the option required
     )
     .setDescription("sets a welcome channel"), // Command description
  async execute(interaction) { // Function to execute when the command is used
     // Creating an embed message for error handling
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Error") // Setting the title of the embed
       .setDescription(
         `You don't have permission to set a welcome channel in this server members in this server`
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
 
     // Getting the selected channel from the command options
     const channel = interaction.options.getChannel("channel");
 
     // Creating an embed message for successful operation
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Welcome Channel Set") // Setting the title of the embed
       .setDescription(
         `Your welcome channel is set to ${channel}. \n To turn off this feature run the command \`/welchannel-disable\``
       ) // Setting the description of the embed
       .setTimestamp() // Adding a timestamp to the embed
       .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed
 
     // Storing the welcome channel ID in the database for the guild
     await db.set(`welchannel_${interaction.guild.id}`, channel.id);
 
     // Replying to the interaction with the success embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 