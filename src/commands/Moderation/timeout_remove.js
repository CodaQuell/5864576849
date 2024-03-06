// Import necessary classes from discord.js
const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("remove-timeout") // Set the command name
     .setDescription("Untimesout a server member") // Set the command description
     .addUserOption((option) => // Add a user option for selecting a member
       option
         .setName("target") // Set the option name
         .setDescription("The user you would like to untimeout") // Set the option description
         .setRequired(true) // Make the option required
     )
     .addStringOption((option) => // Add a string option for the reason
       option
         .setName("reason") // Set the option name
         .setDescription("The reason for untiming out the user") // Set the option description
         .setRequired(false) // Make the option optional
     ),
  async execute(interaction, message, client) {
     // Get the target user and reason from the command options
     const timeUser = interaction.options.getUser("target");
     const timeMember = await interaction.guild.members.fetch(timeUser.id);
     const user = interaction.options.getUser("user") || interaction.user;
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to remove timeouts in this server members in this server`
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
 
     // Check if the bot can untimeout the user
     if (!timeMember.kickable)
       return interaction.reply({
         content:
           "I cannot untimeout this user! This is either because their higher then me or you.",
         ephemeral: true,
       });
     // Check if the user is trying to untimeout themselves
     if (interaction.member.id === timeMember.id)
       return interaction.reply({
         content: "You cannot untimeout yourself!",
         ephemeral: true,
       });
     // Check if the user is trying to untimeout a staff member
     if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator))
       return interaction.reply({
         content:
           "You cannot untimeout staff members or people with the Administrator permission!",
         ephemeral: true,
       });
 
     // Get the reason for untiming out the user
     let reason = interaction.options.getString("reason");
     if (!reason) reason = "No reason given.";
 
     // Untimeout the user
     await timeMember.timeout(null, reason);
 
     // Create an embed to confirm the untimeout
     const minEmbed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle(`User time out removed`)
       .setDescription(
         `${timeUser.tag}'s timeout has been **removed** by ${user.tag} \n \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Reply to the interaction with the confirmation embed
     await interaction.reply({ embeds: [minEmbed] });
  },
 };
 