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
     .setName("kick") // Set the command name
     .setDescription("This command kick members from the server") // Set the command description
     .addUserOption((option) => // Add a user option for selecting a member
       option
         .setName("target") // Set the option name
         .setDescription("The user you would like to kick") // Set the option description
         .setRequired(true) // Make the option required
     )
     .addStringOption((option) => // Add a string option for the reason
       option
         .setName("reason") // Set the option name
         .setDescription("The reason for kicking the user") // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction, client) {
     // Get the target user and reason from the command options
     const kickUser = interaction.options.getUser("target");
     const kickMember = await interaction.guild.members.fetch(kickUser.id);
     const channel = interaction.channel;
     const user = interaction.options.getUser("user") || interaction.user;
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to kick members in this server`
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
 
     // Check if the target user is in the server
     if (!kickMember)
       return await interaction.reply({
         content: "The user mentioned is no longer in the server!",
         ephemeral: true,
       });
     // Check if the bot can kick the user
     if (!kickMember.kickable)
       return await interaction.reply({
         content:
           "I cannot kick this user as they have roles higher than me or you!",
         ephemeral: true,
       });
 
     // Get the reason for kicking the user
     let reason = interaction.options.getString("reason");
     if (!reason) reason = "No reason given.";
 
     // Create an embed to notify the user they have been kicked
     const dmEmbed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("You have been kicked")
       .setDescription(
         `**${kickUser.tag}** has been **kicked** from ${interaction.guild.name} \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Create an embed to confirm the kick
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("User kicked")
       .setDescription(
         `**${kickUser.tag}** has been **kicked** from ${interaction.guild.name} \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Send the notification to the user
     await kickMember.send({ embeds: [dmEmbed] }).catch((err) => {
       return;
     });
 
     // Kick the user
     await kickMember.kick({ reason: reason }).catch((err) => {
       interaction.reply({ content: "There was an error!", ephemeral: true });
     });
 
     // Reply to the interaction with the confirmation embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 