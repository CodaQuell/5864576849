// Import necessary classes from discord.js and a schema for leveling
const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
 } = require("discord.js");
 const levelSchema = require(`../../Schemas/level_schema`);
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("xp-server-reset") // Set the command name
     .setDescription("Resets ALL of the server members xp & levels") // Set the command description
     .addStringOption((option) => // Add a string option for the reason
       option
         .setName("reason") // Set the option name
         .setDescription(`The reason for reseting this user's XP`) // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction, client) {
     // Get the reason for resetting the XP
     let reason = interaction.options.getString("reason");
     if (!reason) reason = "No reason given.";
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to reset xp levels in this server`
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
 
     // Get the guild ID from the interaction
     const { guildId } = interaction;
 
     // Create an embed to confirm the XP reset
     const embed = new EmbedBuilder();
 
     // Delete all level data for the guild from the database
     levelSchema.deleteMany({ Guild: guildId }, async (err, data) => {
       embed
         .setColor("DarkButNotBlack")
         .setTitle("Success")
         .setDescription(
           `The xp system in your server has been reset. \n **Reason:** ${reason}`
         )
         .setTimestamp()
         .setFooter({ text: `${process.env.serverName}` });
 
       // Reply to the interaction with the confirmation embed
       return interaction.reply({ embeds: [embed] });
     });
  },
 };
 