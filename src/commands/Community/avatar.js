// Import necessary modules from discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Export a module for the avatar command
module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("avatar") // Command name
    .setDescription("Get a user's avatar") // Command description
    .addUserOption((options) =>
      options.setName("user").setDescription("The user's avatar you want")
    ),

  // Execution function for the command
  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.member; // Get specified user or default to the command user
    let userAvatar = user.displayAvatarURL({ size: 512 }); // Get the user's avatar URL with size

    // Create an embed to display the user's avatar
    const embed = new EmbedBuilder()
      .setImage(`${userAvatar}`) // Set the image of the embed as the user's avatar
      .setDescription(`${user}'s Avatar`) // Description mentioning the user's avatar
      .setColor("DarkButNotBlack") // Embed color
      .setTimestamp() // Set timestamp
      .setFooter({ text: `${process.env.serverName}` }); // Set footer text

    await interaction.reply({ embeds: [embed] }); // Reply with the embed showing the user's avatar
  },
};
