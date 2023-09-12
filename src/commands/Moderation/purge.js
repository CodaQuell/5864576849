const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  messageLink,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Deletes the specified number of messages (cannot delete messages from 14 or more days ago)"
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to delete")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to purge messages in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    if (!amount)
      return await interaction.reply({
        content:
          "Please specify the amount of messages you would like to purge.",
        ephermal: true,
      });
    if (amount > 100 || amount < 1)
      return await interaction.reply({
        content: "Please choose a number between 1-100.",
        ephermal: true,
      });

    await interaction.channel.bulkDelete(amount).catch((err) => {
      return;
    });
    await interaction.reply({
      content: `Deleted **${amount}** messages.`,
      ephemeral: true,
    });
  },
};
