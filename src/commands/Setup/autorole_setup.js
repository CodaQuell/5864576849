// Importing necessary modules from discord.js and quick.db
const {
  EmbedBuilder, // Used to create rich embed messages
  PermissionsBitField, // Enum for permission flags
  SlashCommandBuilder, // Used to build slash commands
} = require("discord.js");
const { QuickDB } = require("quick.db"); // QuickDB for easy database management
const db = new QuickDB(); // Instance of QuickDB

// Exporting a module with a slash command and its execution logic
module.exports = {
data: new SlashCommandBuilder() // Building a slash command
  .setName("autorole-setup") // Command name
  .setDescription("Sets up the Autorole system") // Command description
  .addRoleOption((option) => // Adding a role option to the command
    option
      .setName("role") // Name of the option
      .setDescription("The role you want members to get when they join.") // Description of the option
      .setRequired(true) // Making the option required
  ),
async execute(interaction) { // Function to execute when the command is used
  // Creating an embed message for error handling
  const perm = new EmbedBuilder()
    .setColor("DarkButNotBlack") // Setting the color of the embed
    .setTitle("Error") // Setting the title of the embed
    .setDescription(
      `You don't have permission to set a autorole in this server members in this server`
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

  // Getting the role from the command options
  const role = interaction.options.getRole("role");

  // Storing the role ID in the database for the guild
  await db.set(`autorole_${interaction.guild.id}`, role.id);

  // Creating an embed message for successful operation
  const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack") // Setting the color of the embed
    .setTitle("Auto Role Set!") // Setting the title of the embed
    .setDescription(
      `Your server's auto role has been set to ${role}.\n To turn off this feature run the command \`/autorole-disable\``
    ) // Setting the description of the embed
    .setTimestamp() // Adding a timestamp to the embed
    .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed

  // Replying to the interaction with the success embed
  await interaction.reply({ embeds: [embed] });
},
};
