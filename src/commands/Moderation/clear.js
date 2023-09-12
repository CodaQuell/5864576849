const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears all the messages in the channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to nuke")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to clear channels in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    try {
      await channel.clone().then(async (msg) => {
        await channel.delete();
        await msg.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Cleared!")
              .setDescription(`Channel cleared by \`${interaction.user.tag}\``)
              .setColor("DarkButNotBlack")
              .setTimestamp()
              .setFooter({ text: `Alto Moderation System` }),
          ],
        });
      });
    } catch (e) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription(`There was an error while clearing this channel.`)
            .setColor("DarkButNotBlack")
            .setTimestamp()
            .setFooter({ text: `Alto Moderation System` }),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Cleared")
          .setDescription(`Successfully cleared selected channel`)
          .setColor("DarkButNotBlack")
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` }),
      ],
    });
  },
};
