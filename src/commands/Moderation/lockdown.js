// Import necessary classes from discord.js
const {
  PermissionsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("lockdown") // Set the command name
     .setDescription("Locks down the specified channel.") // Set the command description
     .addChannelOption((option) => // Add a channel option for selecting a channel
       option
         .setName("channel") // Set the option name
         .setDescription("The channel you want to lock down.") // Set the option description
         .setRequired(true) // Make the option required
     )
     .addStringOption((option) => // Add a string option for the reason
       option
         .setName("reason") // Set the option name
         .setDescription("The reason you locked down the channel.") // Set the option description
     ),
  async execute(interaction, client) {
     // Get the selected channel and reason from the command options
     const channel = interaction.options.getChannel("channel");
     const reason = interaction.options.getString("reason");
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to lockdown channels in this server`
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
 
     // Create an embed to confirm the lockdown
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Channel Lockdown")
       .setDescription(
         `${channel} has been locked down \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Lock down the channel by setting the "Send Messages" permission to false for everyone
     await channel.permissionOverwrites.create(channel.guild.roles.everyone, {
       SendMessages: false,
     });
 
     // Reply to the interaction with the confirmation embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 