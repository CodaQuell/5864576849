const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("member-count") // Command name
    .setDescription("Shows the number of people in the server"), // Command description

  // Execution function for the command
  async execute(interaction) {
    // Reply to the interaction with a message showing the server's member count
    await interaction.reply({
      content: `**${interaction.guild.name}** has **${interaction.guild.memberCount}** members`,
    });
  },
};

