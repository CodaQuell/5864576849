const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('muterole-setup')
    .setDescription('Sets up the mute role')
    .addRoleOption(option => option.setName('role').setDescription('The role you want to be your muterole').setRequired(true)),
    async execute(interaction) {

      const perm = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Error')
      .setDescription(`You don't have permission to set a muterole in this server members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

      const role = interaction.options.getRole('role')

      await db.set(`muterole_${interaction.guild.id}`, role.id)

      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Mute Role Set!')
      .setDescription(`Your server's mute role has been set to ${role}.\n To turn off this feature run the command \`/muterole-disable\` \n *(Please note that you will have to setup the permissons for your muterole yourself, we cannot do that for you.)*`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System`})

      await interaction.reply({ embeds: [embed] });

    }
}