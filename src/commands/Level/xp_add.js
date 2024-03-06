// Import necessary classes from discord.js and a schema for leveling
const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
 } = require("discord.js");
 const levelSchema = require("../../Schemas/level_schema");
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("xp-add") // Set the command name
     .setDescription("Give a user specified amount of XP.") // Set the command description
     .addUserOption((option) => // Add a user option for selecting a user
       option
         .setName("user") // Set the option name
         .setDescription("Specified user will be given specified amount of XP.") // Set the option description
         .setRequired(true) // Make the option required
     )
     .addNumberOption((option) => // Add a number option for the amount of XP
       option
         .setName("amount") // Set the option name
         .setDescription("The amount of XP you want to give specified user.") // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction) {
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(`You don't have permission to add xp in this server`)
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
 
     // Get the target user and the amount of XP from the command options
     const user = interaction.options.getUser("user");
     const amount = interaction.options.getNumber("amount");
 
     // Get the guild ID from the interaction
     const { guildId } = interaction;
 
     // Create an embed to confirm the XP addition
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Added XP")
       .setDescription(`Gave **${user.username}** **${amount}** xp`)
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Find the user's level data in the database
     levelSchema.findOne(
       { Guild: interaction.guild.id, User: user.id },
       async (err, data) => {
         if (err) throw err;
 
         // If the user has no level data, send a message and return
         if (!data)
           return await interaction.reply({
             content: `${user} needs to have **earned** past XP in order to add to their XP.`,
             ephemeral: true,
           });
 
         // Calculate the required XP for the next level
         const requiredXP = data.Level * data.Level * 20 + 20;
         // Add the specified amount of XP to the user's current XP
         data.XP += amount;
         // Save the updated level data
         await data.save();
 
         // Reply to the interaction with the confirmation embed
         interaction.reply({ embeds: [embed] });
       }
     );
  },
 };
 