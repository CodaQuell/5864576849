const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // Setting up the command data using Discord.js SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("moderation-commands")
    .setDescription(
      "Gives a list of commands that only the moderators of the server can use"
    ),

  // Execution function for the command
  async execute(interaction) {
    // Creating an embed to display the list of moderator commands
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("__Moderator Commands__")
      .addFields(
        // Listing different moderation commands with their explanations
        { name: "/ban", value: `This will ban a member from the server` },
        { name: "/unban", value: `Unbans a member using their ID` },
        { name: "/kick", value: `This will kick a member from the server` },
        { name: "/quiet-ban", value: `Bans a member with sending an embed` },
        {
          name: "/quiet-kick",
          value: `Kicks a member without sending an embed`,
        },
        {
          name: "/lockdown",
          value: `Stops members from talking in the channel`,
        },
        { name: "/unlock", value: `Clears the lockdown` },
        { name: "/purge", value: `Deletes bulk messages` },
        {
          name: "/timeout",
          value: "Times out a member for a selected amount of time",
        },
        { name: "/remove-timeout", value: "Removes a member's timeout" },
        { name: "/add-role", value: "Adds a role to a selected member" },
        { name: "/create-channel", value: "This command creates a channel" },
        { name: "/create-category", value: "This command creates a category" },
        { name: "/create-role", value: "Creates a role with a given name" },
        { name: "/delete-channel", value: "Deletes a selected channel" },
        { name: "/delete-role", value: "Deletes a selected role" },
        {
          name: "/message",
          value: "Bot messages member with an admin message",
        },
        { name: "/nick", value: "Changes a user's username" },
        {
          name: "/remove-role",
          value: "Removes a role from a selected member",
        },
        { name: "/tickets", value: "Sets up the ticket system" },
        {
          name: "/verify",
          value: "Creates a verify system that uses a button to verify",
        }
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Sending the embed as a reply to the command interaction
    await interaction.reply({ embeds: [embed] });
  },
};
