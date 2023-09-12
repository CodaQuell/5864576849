const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-channel")
    .setDescription("creates a channel")
    .addStringOption((option) =>
      option.setName("name").setDescription("The roles name").setRequired(true)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guild, user } = interaction;

    const name = options.getString("name");

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

    guild.channels.create({ name: name });

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Channel Created!")
      .setDescription(`The channel ${name} has been created by ${user.tag}`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    interaction.reply({ embeds: [embed] });
  },
};
