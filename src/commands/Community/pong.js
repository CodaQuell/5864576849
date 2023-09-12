const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pong")
    .setDescription("Ping!")
    .setDMPermission(false),
    async execute(interaction, client) {

      return await interaction.reply({ content: `**Ping!** \`took ${client.ws.ping}ms\`` })

    }
}