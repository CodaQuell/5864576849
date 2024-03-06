const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-info") // Command name
    .setDescription(`Get information about Alto`), // Command description

  // Execution function for the command
  async execute(interaction, client) {
    // Calculate bot uptime in days, hours, minutes, and seconds
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    let totalUptime = `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes, \`${seconds}\` seconds`;

    // Get total members and servers the bot is connected to
    let totalMembers = client.users.cache.size;
    let totalServers = client.guilds.cache.size;

    // Get bot's profile picture
    const botPfp = client.user.displayAvatarURL();

    // Build the embed containing bot information
    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: botPfp }) // Bot's tag and profile picture
      .setTitle(`__Alto__`) // Bot's name
      .setThumbnail(botPfp) // Bot's profile picture as a thumbnail
      .setColor("DarkButNotBlack") // Embed color
      .addFields(
        { name: "**Developers**", value: "Coda Quell", inline: true }, // Developer details
        { name: "**Language**", value: "JavaScript/Node.js", inline: true }, // Programming language
        { name: "**Total Servers**", value: `${totalServers}`, inline: false }, // Number of servers
        { name: "**Total Members**", value: `${totalMembers}`, inline: false }, // Number of members
        { name: "**Uptime**", value: `${totalUptime}`, inline: false } // Bot's uptime
      )
      .setTimestamp() // Current timestamp
      .setFooter({ text: `${process.env.serverName}` }); // Footer text

    // Reply with the bot information embed
    await interaction.reply({ embeds: [embed] });
  },
};
