const {
  PermissionsBitField,
  EmbedBuilder,
  SlashCommandBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Locks down the specified channel.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to lock down.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason you locked down the channel.")
    ),
  async execute(interaction, client) {
    const channel = interaction.options.getChannel("channel");
    const reason = interaction.options.getString("reason");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to lockdown channels in this server`
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
      .setTitle("Channel Lockdown")
      .setDescription(
        `${channel} has been locked down \n **Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    channel.permissionOverwrites.create(channel.guild.roles.everyone, {
      SendMessages: false,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
