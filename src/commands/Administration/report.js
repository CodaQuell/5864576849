// Import necessary modules from discord.js library
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

// Import the report schema from a specific path
const reportSchema = require("../../Schemas/report_schema");

// Export a module with a slash command to initiate a report system
module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription(`This is a report command`),

  // Execute function to handle command execution
  async execute(interaction) {
    // Find data in the report schema based on the current guild
    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      // If no data is found, inform the user
      if (!data) {
        return await interaction.reply({
          content: "The report system has not been set up yet",
          ephemeral: true,
        });
      }

      // If data is found, create a modal for report submission
      if (data) {
        // Create a modal for the report form
        const modal = new ModalBuilder()
          .setTitle("Report form")
          .setCustomId(`modal`);

        // Create text input fields for the report form
        const contact = new TextInputBuilder()
          .setCustomId("contact")
          .setRequired(true)
          .setLabel(`Provide us with an email or username`)
          .setPlaceholder("Example codaquell@gmail.com")
          .setStyle(TextInputStyle.Short);

        const issue = new TextInputBuilder()
          .setCustomId("issue")
          .setRequired(true)
          .setLabel(`What would you like to report?`)
          .setPlaceholder("A member, server issue, or something else?")
          .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
          .setCustomId("description")
          .setRequired(true)
          .setLabel(`Describe the issue you are reporting`)
          .setPlaceholder("Be as detailed as possible")
          .setStyle(TextInputStyle.Paragraph);

        // Create action rows to organize the text input fields
        const firstActionRow = new ActionRowBuilder().addComponents(contact);
        const secondActionRow = new ActionRowBuilder().addComponents(issue);
        const thirdActionRow = new ActionRowBuilder().addComponents(description);

        // Add text input components to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user for report submission
        interaction.showModal(modal);
      }
    });
  },
};
