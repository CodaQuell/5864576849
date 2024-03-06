// Import necessary classes from discord.js
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

// Export an object with command data and an execute function
module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info") // Set the command name
    .setDescription("Get info on a user") // Set the command description
    .addUserOption(
      (
        option // Add a user option for selecting a user
      ) =>
        option
          .setName("user") // Set the option name
          .setDescription("The user to get info on") // Set the option description
          .setRequired(true) // Make the option required
    ),
  async execute(interaction) {
    // Get the selected user from the command options, or the user who invoked the command if no user is specified
    const user = interaction.options.getUser("user") || interaction.user;
    // Fetch the member object for the selected user
    const member = await interaction.guild.members.fetch(user.id);
    // Get the user's display avatar URL and tag
    const icon = user.displayAvatarURL();
    const tag = user.tag;

    // Create an embed to display the user's information
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setAuthor({ name: tag, iconURL: icon }) // Set the author to the user's tag and avatar
      .setTitle(`__${user.tag}__`) // Set the title to the user's tag
      .setThumbnail(icon) // Set the thumbnail to the user's avatar
      .addFields(
        { name: "Member", value: `${user}`, inline: false }, // Display the user's mention
        {
          name: "Roles",
          value: `${member.roles.cache.map((r) => r).join(" ")}`, // Display the user's roles
          inline: false,
        },
        {
          name: "Joined Server",
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, // Display the date the user joined the server
          inline: true,
        },
        {
          name: "Joined Discord",
          value: `<t:${parseInt(user.createdAt / 1000)}:R>`, // Display the date the user joined Discord
          inline: true,
        }
      )
      .setTimestamp() // Set the timestamp to the current time
      .setFooter({ text: `${process.env.serverName}` }); // Set the footer to "Alto Information System"

    // Reply to the interaction with the embed
    await interaction.reply({ embeds: [embed] });
  },
};
