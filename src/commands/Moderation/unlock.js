const {
  PermissionsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks the specified channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to unlock.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    const user = interaction.options.getUser("user") || interaction.user;

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to unlock channels in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Channel unlocked")
      .setDescription(`${channel} has been unlocked.`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    channel.permissionOverwrites.create(channel.guild.roles.everyone, {
      SendMessages: true,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
