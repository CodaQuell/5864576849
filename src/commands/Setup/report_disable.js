// Importing necessary modules from discord.js and a custom schema for reports
const {
  SlashCommandBuilder, // Used to build slash commands
  EmbedBuilder, // Used to create rich embed messages
  PermissionsBitField, // Enum for permission flags
  ChannelType, // Enum for channel types
} = require("discord.js");
const reportSchema = require("../../Schemas/report_schema"); // Custom schema for reports

// Exporting a module with a slash command and its execution logic
module.exports = {
  data: new SlashCommandBuilder() // Building a slash command
      .setName("report-disable") // Command name
      .setDescription(`This disables the report system`), // Command description
  async execute(interaction) { // Function to execute when the command is used
      // Creating an embed message for error handling
      const perm = new EmbedBuilder()
          .setColor("DarkButNotBlack") // Setting the color of the embed
          .setTitle("Error") // Setting the title of the embed
          .setDescription(
              `You don't have permission to disable reports in this server`
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

      // Extracting necessary information from the interaction
      const { channel, guildId, options } = interaction;
      const repChannel = options.getChannel("channel");

      // Creating an embed message for successful operation
      const embed = new EmbedBuilder();

      // Deleting all report entries for the guild
      reportSchema.deleteMany({ Guild: guildId }, async (err, data) => {
          if (err) {
              console.error(err);
              return await interaction.reply({
                  content: "An error occurred while disabling the report system",
                  ephemeral: true,
              });
          }

          embed
              .setColor("DarkButNotBlack") // Setting the color of the embed
              .setTitle("Success") // Setting the title of the embed
              .setDescription(
                  `The report system has been removed. \n To turn on this feature run the command \`/report-setup\``
              ) // Setting the description of the embed
              .setTimestamp() // Adding a timestamp to the embed
              .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed

          // Replying to the interaction with the success embed
          return await interaction.reply({ embeds: [embed] });
      });
  },
};
