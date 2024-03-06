// Import necessary classes from discord.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
 } = require("discord.js");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("add-role") // Set the command name
     .setDescription("Give roles to members") // Set the command description
     .addUserOption((option) => // Add a user option for selecting a member
       option
         .setName("member") // Set the option name
         .setDescription("Select a member to assign a role to") // Set the option description
         .setRequired(true) // Make the option required
     )
     .addRoleOption((option) => // Add a role option for selecting a role
       option
         .setName("role") // Set the option name
         .setDescription("Select the role to assign to the member") // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction) {
     // Get the user who invoked the command and the selected member and role from the command options
     const user = interaction.user;
     const member = interaction.options.getMember("member");
     const role = interaction.options.getRole("role");
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to add roles to members in this server`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Create an embed for error messages if the bot does not have permission
     const botPerm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `I don't have permission to add roles to members in this server`
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
 
     // Check if the bot has administrator permissions
     if (
       !interaction.guild.members.me.permissions.has(
         PermissionsBitField.Flags.Administrator
       )
     )
       // If not, reply with the bot error embed and return
       return await interaction.reply({ embeds: [botPerm], ephemeral: true });
 
     // Add the selected role to the selected member
     member.roles.add(role);
 
     // Create an embed to confirm the role addition
     await interaction.reply({
       embeds: [
         new EmbedBuilder()
           .setDescription(
             `**${role}** roles has been **added** to **${member}**`
           )
           .setColor("DarkButNotBlack")
           .setTitle("Role Added!")
           .setTimestamp()
           .setFooter({ text: `${process.env.serverName}` }),
       ],
     });
  },
 };
 