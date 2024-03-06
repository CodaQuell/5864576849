const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping") // Command name
    .setDescription("Pong!"), // Command description

  // Execution function for the command
  async execute(interaction, client) {
    return await interaction.reply({
      // Reply with an embed displaying the bot's ping
      embeds: [
        new EmbedBuilder()
          .setDescription(`**Pong!** \`${client.ws.ping}ms\``) // Display the ping in milliseconds
          .setColor("DarkButNotBlack"), // Set the embed color
      ],
    });
  },
};
