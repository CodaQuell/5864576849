const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a banned user from this discord server")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("discord ID of the user")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { channel, options } = interaction;

    const userId = options.getString("userid");
    const user = interaction.options.getUser("user") || interaction.user;

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to unban members in this server`
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
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setTitle("Member Unbanned")
        .setDescription(
          `**${user.tag}** Unbaned **${userId}** from the **${interaction.guild.name}**`
        )
        .setColor("DarkButNotBlack")
        .setTimestamp()
        .setFooter({ text: `Alto Moderation System` });

      await interaction.reply({
        embeds: [embed],
      });
    } catch (err) {
      console.log(err);

      const errEmbed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Error")
        .setDescription(`Please provide valid user ID`)
        .setTimestamp()
        .setFooter({ text: `Alto Moderation System` });

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
