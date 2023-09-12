const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-info")
    .setDescription(`Get information about Alto`),

  async execute(interaction, client) {
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 23;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    let totalUptime = `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes \`${seconds}\` seconds`;

    let totalMembers = client.users.cache.size;
    let totalServers = client.guilds.cache.size;

    const botPfp = client.user.displayAvatarURL();

    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: botPfp })
      .setTitle(`__Alto__`)
      .setThumbnail(botPfp)
      .setColor("DarkButNotBlack")
      .addFields(
        { name: "**Developers**", value: "Coda Quell", inline: true },
        { name: "**Language**", value: "JavaScript", inline: true },
        { name: "**Total Servers**", value: `${totalServers}`, inline: false },
        { name: "**Total Members**", value: `${totalMembers}`, inline: false },
        { name: "**Uptime**", value: `${totalUptime}`, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Alto Information System` });

    await interaction.reply({ embeds: [embed] });
  },
};
