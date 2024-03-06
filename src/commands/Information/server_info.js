// Import necessary classes from discord.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Export an object with command data and an execute function
module.exports = {
 data: new SlashCommandBuilder()
    .setName("server-info") // Set the command name
    .setDescription("This gets some server info"), // Set the command description
 async execute(interaction) {
    // Destructure the guild object from the interaction
    const { guild } = interaction;
    // Destructure the members collection from the guild
    const { members } = guild;
    // Destructure specific properties from the guild
    const { name, ownerId, memberCount } = guild;
    // Get the guild's icon URL, or a default image if none is set
    const icon =
      guild.iconURL() ||
      `https://media.discordapp.net/attachments/978035586168418334/9783042826351943800/unnamed.png`;
    // Get the number of roles and emojis in the guild
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    // Get the guild's ID
    const id = guild.id;

    // Create an embed to display the server information
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setThumbnail(icon) // Set the thumbnail to the guild's icon
      .setTitle(`__${guild}__`) // Set the title to the guild's name
      .setAuthor({ name: name, iconURL: icon }) // Set the author to the guild's name and icon
      .setFooter({ text: `Server ID ${id}` }) // Set the footer to the guild's ID
      .setTimestamp() // Set the timestamp to the current time
      .addFields(
        { name: "Name", value: `${name}`, inline: false },
        {
          name: "Date Created",
          value: `<t:${parseInt(guild.createdAt / 1000)}:R> `, // Format the creation date
          inline: true,
        },
        { name: "Server Owner", value: `<@${ownerId}>`, inline: true }, // Display the server owner
        { name: "Server Members", value: `${memberCount}`, inline: true }, // Display the number of members
        { name: "Role Amount", value: `${roles}`, inline: true }, // Display the number of roles
        { name: "Emoji Amount", value: `${emojis}`, inline: true }, // Display the number of emojis
        {
          name: "Server Boosts",
          value: `${guild.premiumSubscriptionCount}`, // Display the number of server boosts
          inline: true,
        }
      )
      .setTimestamp() // Set the timestamp again, this is likely a mistake and can be removed
      .setFooter({ text: `${process.env.serverName}` }); // Set the footer to "Alto Information System"

    // Reply to the interaction with the embed
    await interaction.reply({ embeds: [embed] });
 },
};
