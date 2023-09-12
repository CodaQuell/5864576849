const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-channel")
    .setDescription("deletes a channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to delete")
        .setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guild, user } = interaction;

    const channel = options.getChannel("channel");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to create channels in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    guild.channels.delete(channel);

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Channel Deleted")
      .setDescription(
        `The channel ${channel.id} has been deleted by ${user.tag}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    interaction.reply({ embeds: [embed] });
  },
};
