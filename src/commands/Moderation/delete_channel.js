// Import necessary classes from discord.js
const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("delete-channel") // Set the command name
     .setDescription("deletes a channel") // Set the command description
     .addChannelOption((option) => // Add a channel option for selecting a channel
       option
         .setName("channel") // Set the option name
         .setDescription("The channel you want to delete") // Set the option description
         .setRequired(true) // Make the option required
     ),
  /**
  *
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
     const { options, guild, user } = interaction;
 
     // Get the selected channel from the command options
     const channel = options.getChannel("channel");
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to create channels in this server`
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
 
     // Delete the selected channel
     guild.channels.delete(channel);
 
     // Create an embed to confirm the channel deletion
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Channel Deleted")
       .setDescription(
         `The channel ${channel.id} has been deleted by ${user.tag}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Reply to the interaction with the confirmation embed
     interaction.reply({ embeds: [embed] });
  },
 };
 