const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the invite link for Alto'),
    async execute(interaction) {

      const embed = new EmbedBuilder()
        .setColor('DarkButNotBlack')
        .setTitle('Click here to add Alto to your server.')
        .setURL('https://discord.com/api/oauth2/authorize?client_id=1102871455068327977&permissions=28033184955639&scope=bot%20applications.commands')
        .setFooter({ text: `Alto Invite Link`})
        .setTimestamp()
      await interaction.reply({ embeds: [embed] })
    },
}