const { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-role")
        .setDescription("creates a role")
        .addStringOption(option => option.setName("name").setDescription("The roles name").setRequired(true))
        .addStringOption(option => option.setName("color").setDescription("The roles color (hex)")),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(interaction) {
    const { options, guild, user } = interaction;

    const name = options.getString('name');
    const color = options.getString('color');

    const perm = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Error')
    .setDescription(`You don't have permission to create roles in this server`)
    .setTimestamp()
    .setFooter({ text: `Alto Moderation System`})

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })

    guild.roles.create({ name: name, color: color })

    const embed = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Role Created')
    .setDescription(`The role ${name.id} has been created by ${user.tag}`)
    .setTimestamp()
    .setFooter({ text: `Alto Moderation System`})

    interaction.reply({embeds: [embed]})
  }
}