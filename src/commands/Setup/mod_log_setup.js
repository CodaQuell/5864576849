// Importing necessary modules from discord.js and a custom schema for mod log
const {
  PermissionsBitField, // Enum for permission flags
  SlashCommandBuilder, // Used to build slash commands
  EmbedBuilder, // Used to create rich embed messages
  ChannelType, // Enum for channel types
 } = require("discord.js");
 const Modlog = require("../../Schemas/mod_log_schema"); // Custom schema for mod log
 
 // Exporting a module with a slash command and its execution logic
 module.exports = {
  data: new SlashCommandBuilder() // Building a slash command
     .setName("modlog-setup") // Command name
     .setDescription("Sets up the mod log channel for this server.") // Command description
     .addChannelOption((option) => // Adding a channel option to the command
       option
         .setName("channel") // Name of the option
         .setDescription("The channel to set as the mod log channel") // Description of the option
         .addChannelTypes(ChannelType.GuildText) // Restricting the option to text channels
         .setRequired(true) // Making the option required
     ),
  async execute(interaction) { // Function to execute when the command is used
     const guildId = interaction.guild.id; // Getting the guild ID
     const logChannelId = interaction.options.getChannel("channel").id; // Getting the selected channel ID
 
     // Creating an embed message for error handling
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack") // Setting the color of the embed
       .setTitle("Error") // Setting the title of the embed
       .setDescription(
         `You don't have permission to setup a moderation logging channel in this server`
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
       let modlog = await Modlog.findOne({ guildId });
       if (modlog) {
         // If a mod log entry is found, inform the user
         return interaction.reply({
           content: "A mod log channel has already been set up for this server.",
           ephemeral: true,
         });
       }
 
       // Updating or creating a mod log entry for the guild
       modlog = await Modlog.findOneAndUpdate(
         { guildId },
         { logChannelId },
         { upsert: true } // Create a new document if no documents match the filter
       );
 
       // Replying to the interaction with a success embed
       return interaction.reply({
         embeds: [
           new EmbedBuilder()
             .setTitle("ModLog Channel Set") // Setting the title of the embed
             .setDescription(
               `Mod log channel set to <#${logChannelId}>. \n To turn off this feature run the command \`/modlog-disable\``
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
       return interaction.reply(
         "An error occurred while setting up the mod log channel"
       );
     }
  },
 };
 