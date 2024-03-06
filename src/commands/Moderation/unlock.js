// Import necessary classes from discord.js
const {
  PermissionsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("unlock") // Set the command name
     .setDescription("Unlocks the specified channel.") // Set the command description
     .addChannelOption((option) => // Add a channel option for selecting a channel
       option
         .setName("channel") // Set the option name
         .setDescription("The channel you want to unlock.") // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction, client) {
     // Get the selected channel from the command options
     const channel = interaction.options.getChannel("channel");
     // Get the user who invoked the command
     const user = interaction.options.getUser("user") || interaction.user;
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to unlock channels in this server`
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
 
     // Create an embed to confirm the channel unlock
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Channel unlocked")
       .setDescription(`${channel} has been unlocked.`)
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Unlock the channel by allowing everyone to send messages
     channel.permissionOverwrites.create(channel.guild.roles.everyone, {
       SendMessages: true,
     });
 
     // Reply to the interaction with the confirmation embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 