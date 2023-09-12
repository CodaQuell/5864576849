const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("This command kick members from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for kicking the user")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const kickUser = interaction.options.getUser("target");
    const kickMember = await interaction.guild.members.fetch(kickUser.id);
    const channel = interaction.channel;
    const user = interaction.options.getUser("user") || interaction.user;

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to kick members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    if (!kickMember)
      return await interaction.reply({
        content: "The user mentioned is no longer in the server!",
        ephemeral: true,
      });
    if (!kickMember.kickable)
      return await interaction.reply({
        content:
          "I cannot kick this user as they have roles higher than me or you!",
        ephemeral: true,
      });

    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason given.";

    const dmEmbed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("You have been kicked")
      .setDescription(
        `**${kickUser.tag}** has been **kicked** from ${interaction.guild.name} \n **Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("User kicked")
      .setDescription(
        `**${kickUser.tag}** has been **kicked** from ${interaction.guild.name} \n Reason: ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    await kickMember.send({ embeds: [dmEmbed] }).catch((err) => {
      return;
    });

    await kickMember.kick({ reason: reason }).catch((err) => {
      interaction.reply({ content: "There was an error!", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
