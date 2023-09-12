const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("community-commands")
    .setDescription(
      "gives a list of commands that everyone in the server can use"
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("__Community Commands__")
      .addFields(
        { name: "/help", value: "Brings up the help menu" },
        { name: "/8ball", value: "This will bring up the classic 8ball game" },
        { name: "/coinflip", value: "This command lets you flip a coin" },
        { name: "/enlarge", value: "Enlarge any emoji with this command" },
        {
          name: "/member-count",
          value: "Gives the number of members in the server",
        },
        { name: "/note", value: "Create a note on any member" },
        { name: "/notes", value: "View the note that you made earlier" },
        {
          name: "/remove-notes",
          value: "Clear any notes that you or someone else has made",
        },
        { name: "/ping | /pong", value: "See the ping that the bot is on" },
        {
          name: "/report",
          value:
            "Give a detailed report to the admins of the server about any problems you are having",
        },
        { name: "/say", value: "Get the bot to say anything" },
        { name: "/avatar", value: "Get a bigger image of anyones avatar" },
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
        { name: "/rank", value: "Will show your xp rank card" },
        {
          name: "/xp-leaderboard",
          value: "Will show the top 10 people in the sever",
        }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    await interaction.reply({ embeds: [embed] });
  },
};
