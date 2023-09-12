const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const reportSchema = require("../../schemas/report");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-setup")
    .setDescription(`This sets up the report system`)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(`The channel you want the reports to be sent to`)
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  async execute(interaction, client) {
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

    reportSchema.findOne({ Guild: guildId }, async (err, data) => {
      if (!data) {
        await reportSchema.create({
          Guild: guildId,
          Channel: repChannel.id,
        });

        embed
          .setColor("DarkButNotBlack")
          .setTitle("Success")
          .setDescription(
            `All submitted reports will be sent in ${repChannel}. \n To turn off this feature run the command \`/report-disable\``
          )
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` });
      } else if (data) {
        const c = client.channels.cache.get(data.Channel);
        embed
          .setColor("DarkButNotBlack")
          .setTitle("Error")
          .setDescription(
            `Your report channel has already been set to ${c}. \n To turn off this feature run the command \`/report-disable\``
          )
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` });
      }

      return await interaction.reply({ embeds: [embed] });
    });
  },
};
