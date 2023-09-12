const { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-role")
        .setDescription("deletes selected role")
        .addRoleOption(option => option.setName("role").setDescription("the role you want to delete").setRequired(true)),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options, guild, user } = interaction;

    const deleterole = interaction.options.getRole(`role`);

    const perm = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Error')
    .setDescription(`You don't have permission to delete roles in this server`)
    .setTimestamp()
    .setFooter({ text: `Alto Moderation System`})

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

    guild.roles.delete(deleterole)

    const embed = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Role Deleted')
    .setDescription(`The role ${deleterole.id} has been deleted by ${user.tag}`)
    .setTimestamp()
    .setFooter({ text: `Alto Moderation System`})

    await interaction.reply({embeds: [embed]})
    }
}