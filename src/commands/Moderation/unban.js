// Import necessary classes from discord.js
const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("unban") // Set the command name
     .setDescription("Unban a banned user from this discord server") // Set the command description
     .addStringOption((option) => // Add a string option for the user ID
       option
         .setName("userid") // Set the option name
         .setDescription("discord ID of the user") // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction, client) {
     // Get the interaction's channel and options
     const { channel, options } = interaction;
 
     // Get the user ID from the command options
     const userId = options.getString("userid");
     // Get the user who invoked the command
     const user = interaction.options.getUser("user") || interaction.user;
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to unban members in this server`
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
 
     try {
       // Attempt to unban the user by their ID
       await interaction.guild.members.unban(userId);
 
       // Create an embed to confirm the unban
       const embed = new EmbedBuilder()
         .setTitle("Member Unbanned")
         .setDescription(
           `**${user.tag}** Unbaned **${userId}** from the **${interaction.guild.name}**`
         )
         .setColor("DarkButNotBlack")
         .setTimestamp()
         .setFooter({ text: `${process.env.serverName}` });
 
       // Reply to the interaction with the confirmation embed
       await interaction.reply({
         embeds: [embed],
       });
     } catch (err) {
       // Log the error
       console.log(err);
 
       // Create an embed for error messages if the user ID is invalid
       const errEmbed = new EmbedBuilder()
         .setColor("DarkButNotBlack")
         .setTitle("Error")
         .setDescription(`Please provide valid user ID`)
         .setTimestamp()
         .setFooter({ text: `${process.env.serverName}` });
 
       // Reply to the interaction with the error embed
       interaction.reply({ embeds: [errEmbed], ephemeral: true });
     }
  },
 };
 