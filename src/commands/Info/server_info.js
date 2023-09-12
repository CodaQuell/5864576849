const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("This gets some server info"),
  async execute(interaction) {
    const { guild } = interaction;
    const { members } = guild;
    const { name, ownerId, memberCount } = guild;
    const icon =
      guild.iconURL() ||
      `https://media.discordapp.net/attachments/978035586168418334/9783042826351943800/unnamed.png`;
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const id = guild.id;

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setThumbnail(icon)
      .setTitle(`__${guild}__`)
      .setAuthor({ name: name, iconURL: icon })
      .setFooter({ text: `Server ID ${id}` })
      .setTimestamp()
      .addFields(
        { name: "Name", value: `${name}`, inline: false },
        {
          name: "Date Created",
          value: `<t:${parseInt(guild.createdAt / 1000)}:R> `,
          inline: true,
        },
        { name: "Server Owner", value: `<@${ownerId}>`, inline: true },
        { name: "Server Members", value: `${memberCount}`, inline: true },
        { name: "Role Amount", value: `${roles}`, inline: true },
        { name: "Emoji Amount", value: `${emojis}`, inline: true },
        {
          name: "Server Boosts",
          value: `${guild.premiumSubscriptionCount}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: `Alto Information System` });

    await interaction.reply({ embeds: [embed] });
  },
};
