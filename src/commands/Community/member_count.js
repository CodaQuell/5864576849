const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("member-count")
    .setDescription("Shows the number of people in the server"),
  async execute(interaction) {
    await interaction.reply({
      content: `**${interaction.guild.name}** has **${interaction.guild.memberCount}** members`,
    });
  },
};
