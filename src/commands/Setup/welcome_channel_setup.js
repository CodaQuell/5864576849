const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, ChannelType } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('welchannel-setup')
    .addChannelOption(option => option.setName('channel').setDescription('the channel you want your welcome messages sent to').addChannelTypes(ChannelType.GuildText).setRequired(true))
    .setDescription('sets a welcome channel'),
    async execute(interaction) {

      const perm = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Error')
      .setDescription(`You don't have permission to set a welcome channel in this server members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

      const channel = interaction.options.getChannel('channel')

      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Welcome Channel Set!')
      .setDescription(`Your welcome channel is set to ${channel}. \n To turn off this feature run the command \`/welchannel-disable\``)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      await db.set(`welchannel_${interaction.guild.id}`, channel.id)

      await interaction.reply({ embeds: [embed] });

    }
}