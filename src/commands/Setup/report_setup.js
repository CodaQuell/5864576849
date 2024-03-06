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
      .setName("report-setup") // Command name
      .setDescription(`This sets up the report system`) // Command description
      .addChannelOption((option) => // Adding a channel option to the command
          option
              .setName("channel") // Name of the option
              .setDescription(`The channel you want the reports to be sent to`) // Description of the option
              .addChannelTypes(ChannelType.GuildText) // Restricting the option to text channels
              .setRequired(true) // Making the option required
      ),
  async execute(interaction, client) { // Function to execute when the command is used
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

      // Finding the report entry for the guild
      reportSchema.findOne({ Guild: guildId }, async (err, data) => {
          if (err) {
              console.error(err);
              return await interaction.reply({
                  content: "An error occurred while setting up the report system",
                  ephemeral: true,
              });
          }

          if (!data) {
              // If no report entry is found, create a new one
              await reportSchema.create({
                  Guild: guildId,
                  Channel: repChannel.id,
              });

              embed
                  .setColor("DarkButNotBlack") // Setting the color of the embed
                  .setTitle("Success") // Setting the title of the embed
                  .setDescription(
                      `All submitted reports will be sent in ${repChannel}. \n To turn off this feature run the command \`/report-disable\``
                  ) // Setting the description of the embed
                  .setTimestamp() // Adding a timestamp to the embed
                  .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed
          } else if (data) {
              // If a report entry is found, inform the user
              const c = client.channels.cache.get(data.Channel);
              embed
                  .setColor("DarkButNotBlack") // Setting the color of the embed
                  .setTitle("Error") // Setting the title of the embed
                  .setDescription(
                      `Your report channel has already been set to ${c}. \n To turn off this feature run the command \`/report-disable\``
                  ) // Setting the description of the embed
                  .setTimestamp() // Adding a timestamp to the embed
                  .setFooter({ text: `${process.env.serverName}` }); // Setting the footer of the embed
          }

          // Replying to the interaction with the appropriate embed
          return await interaction.reply({ embeds: [embed] });
      });
  },
};
