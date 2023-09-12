const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder} = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('muterole-disable')
    .setDescription('Sets up the mute role'),
    async execute(interaction) {

      const perm = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Error')
      .setDescription(`You don't have permission to disable a muterole in this server members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

      await db.delete(`muterole_${interaction.guild.id}`)

      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Mute Role Disabled!')
      .setDescription(`Your mute role has been disabled.\n To turn on this feature run the command \`/mute-disable\``)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      await interaction.reply({ embeds: [embed] });

    }
}