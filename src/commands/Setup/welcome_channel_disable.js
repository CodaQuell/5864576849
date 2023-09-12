const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('welchannel-disable')
    .setDescription('disables the welcome channel'),
    async execute(interaction) {

      const perm = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Error')
      .setDescription(`You don't have permission to disabler the welcome channel in this server members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

      const channel = interaction.options.getChannel('channel')

      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Welcome Channel Disabled!')
      .setDescription(`Your welcome channel has been disabled. \n To turn on this feature run the command \`/welchannel-setup\``)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      await db.delete(`wel_channel${interaction.guild.id}`)

      await interaction.reply({ embeds: [embed] });

    }
}