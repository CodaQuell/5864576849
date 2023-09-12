const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction, client) {
    return await interaction.reply({
      content: `**Pong!** \`took ${client.ws.ping}ms\``,
    });
  },
};
