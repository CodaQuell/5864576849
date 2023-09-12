const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("This command bans members from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for banning the user")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const banUser = interaction.options.getUser("target");
    const banMember = await interaction.guild.members.fetch(banUser.id);
    const channel = interaction.channel;
    const user = interaction.options.getUser("user") || interaction.user;

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to ban members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    if (!banMember)
      return await interaction.reply({
        content: "The user mentioned is no longer in the server!",
        ephemeral: true,
      });
    if (!banMember.kickable)
      return await interaction.reply({
        content:
          "I cannot ban this user as they have roles higher than me or you!",
        ephemeral: true,
      });

    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason given.";

    const dmEmbed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("You have been banned")
      .setDescription(
        `**${banUser.tag}** has been **banned** from ${interaction.guild.name}] \n **Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("User Banned")
      .setDescription(
        `**${banUser.tag}** has been **banned** from ${interaction.guild.name}] \n Reason: ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
      return;
    });

    await banMember.ban({ reason: reason }).catch((err) => {
      interaction.reply({ content: "There was an error!", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
