const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Get info on a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get info on")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const icon = user.displayAvatarURL();
    const tag = user.tag;

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setAuthor({ name: tag, iconURL: icon })
      .setTitle(`__${user.tag}__`)
      .setThumbnail(icon)
      .addFields(
        { name: "Member", value: `${user}`, inline: false },
        {
          name: "Roles",
          value: `${member.roles.cache.map((r) => r).join(" ")}`,
          inline: false,
        },
        {
          name: "Joined Server",
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined Discord",
          value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Information System" });

    await interaction.reply({ embeds: [embed] });
  },
};
