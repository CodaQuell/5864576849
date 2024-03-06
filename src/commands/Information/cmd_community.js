const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // Setting up the command data using Discord.js SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("community-commands")
    .setDescription(
      "Gives a list of commands that everyone in the server can use"
    ),

  // Execution function for the command
  async execute(interaction) {
    // Creating an embed to display the list of community commands
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("__Community Commands__")
      .addFields(
        // Listing different commands available to the community with their explanations
        { name: "/help", value: "Brings up the help menu" },
        { name: "/8ball", value: "This will bring up the classic 8ball game" },
        { name: "/coinflip", value: "This command lets you flip a coin" },
        {
          name: "/member-count",
          value: "Gives the number of members in the server",
        },
        { name: "/ping", value: "See the ping that the bot is on" },
        {
          name: "/report",
          value:
            "Give a detailed report to the admins of the server about any problems you are having within the server",
        },
        { name: "/say", value: "Get the bot to say anything" },
        { name: "/avatar", value: "Get a bigger image of anyone's avatar" },
        { name: "/bot-info", value: "Get information about Alto" },
        {
          name: "/server-info",
          value: "Get information about the server you are in",
        },
        { name: "/user-info", value: "Get information about a member" },
        { name: "/invite", value: "Get Alto's invite link" },
        { name: "/community-commands", value: "Brings up this menu" },
        {
          name: "/moderator-commands",
          value: "Will bring up the moderator commands menu",
        },
        { name: "/rank", value: "Will show your XP rank card" },
        {
          name: "/xp-leaderboard",
          value: "Will show the top 10 people in the server",
        }
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Sending the embed as a reply to the command interaction
    await interaction.reply({ embeds: [embed] });
  },
};
