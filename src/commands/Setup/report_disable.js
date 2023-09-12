const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const reportSchema = require("../../schemas/report");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-disable")
    .setDescription(`This disables the report system`),
  async execute(interaction) {
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to disable reports in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const { channel, guildId, options } = interaction;
    const repChannel = options.getChannel("channel");

    const embed = new EmbedBuilder();

    reportSchema.deleteMany({ Guild: guildId }, async (err, data) => {
      embed
        .setColor("DarkButNotBlack")
        .setTitle("Success")
        .setDescription(
          `The report system has been removed. \n To turn on this feature run the command \`/report-setup\``
        )
        .setTimestamp()
        .setFooter({ text: `Alto Moderation System` });

      return await interaction.reply({ embeds: [embed] });
    });
  },
};
