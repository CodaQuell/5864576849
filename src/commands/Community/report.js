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
const reportSchema = require("../../schemas/report");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription(`This is a report command`),
  async execute(interaction) {
    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) {
        return await interaction.reply({
          content: "The report system has not been setup yet",
          ephemeral: true,
        });
      }

      if (data) {
        const modal = new ModalBuilder()
          .setTitle("Report form")
          .setCustomId(`modal`);

        const contact = new TextInputBuilder()
          .setCustomId("contact")
          .setRequired(true)
          .setLabel(`Provide us with an email`)
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

        const firstActionRow = new ActionRowBuilder().addComponents(contact);
        const secondActionRow = new ActionRowBuilder().addComponents(issue);
        const thirdActionRow = new ActionRowBuilder().addComponents(
          description
        );

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        interaction.showModal(modal);
      }
    });
  },
};
