const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation-commands")
    .setDescription(
      "gives a list of commands that only the moderators of the server can use"
    ),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("__Moderator Commands__")
      .addFields(
        { name: "/ban", value: `This will ban a member from the server` },
        { name: "/unban", value: `Unbans a member using their id` },
        { name: "/kick", value: `This will kick a member from the server` },
        { name: "/quiet-ban", value: `Bans a member with sending an embed` },
        {
          name: "/quiet-kick",
          value: `Kicks a member without sending an embed`,
        },
        { name: "/clear", value: `Clears out the channel completely` },
        {
          name: "/lockdown",
          value: `Stops members from talking in the channel`,
        },
        { name: "/unlock", value: `Clears the lockdown` },
        { name: "/purge", value: `Deletes bulk messages` },
        {
          name: "/timeout",
          value: "Timesout a member for selected amout of time",
        },
        { name: "/remove-timeout", value: "Removes a members timeout" },
        { name: "/add-moji", value: "Adds selected emoji to server" },
        { name: "/add-role", value: "Adds a role to selected member" },
        { name: "/create-channel", value: "This command creates a channel" },
        { name: "/create-role", value: "Creates a role with given name " },
        { name: "/delete-channel", value: "Deletes selected channel" },
        { name: "/delete-role", value: "Deletes selected role" },
        { name: "/message", value: "Bot messages member with admin message" },
        { name: "/mute", value: "Stops member from talking in channels" },
        { name: "/nick", value: "Changes a user's username" },
        { name: "/remove-role", value: "Removes role form selected member" },
        { name: "/tickets", value: "Sets up the ticket system" },
        {
          name: "/verify",
          value: "Creates a verify system that uses a button to verify",
        }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    await interaction.reply({ embeds: [embed] });
  },
};
