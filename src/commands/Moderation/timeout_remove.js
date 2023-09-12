const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-timeout")
    .setDescription("Untimesout a server member")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to untimeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for untiming out the user")
        .setRequired(false)
    ),
  async execute(interaction, message, client) {
    const timeUser = interaction.options.getUser("target");
    const timeMember = await interaction.guild.members.fetch(timeUser.id);
    const user = interaction.options.getUser("user") || interaction.user;

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to remove timeouts in this server members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    if (!timeMember.kickable)
      return interaction.reply({
        content:
          "I cannot timeout this user! This is either because their higher then me or you.",
        ephemeral: true,
      });
    if (interaction.member.id === timeMember.id)
      return interaction.reply({
        content: "You cannot timeout yourself!",
        ephemeral: true,
      });
    if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({
        content:
          "You cannot untimeout staff members or people with the Administrator permission!",
        ephemeral: true,
      });

    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason given.";

    await timeMember.timeout(null, reason);

    const minEmbed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`User time out removed`)
      .setDescription(
        `${timeUser.tag}'s timeout has been **removed** by ${user.tag} \n \n **Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    await interaction.reply({ embeds: [minEmbed] });
  },
};
