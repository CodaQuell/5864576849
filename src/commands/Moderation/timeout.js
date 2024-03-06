// Import necessary classes from discord.js
const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");

// Export an object with command data and an execute function
module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout") // Set the command name
    .setDescription("Times out a server member") // Set the command description
    .addUserOption(
      (
        option // Add a user option for selecting a member
      ) =>
        option
          .setName("target") // Set the option name
          .setDescription("The user you would like to time out") // Set the option description
          .setRequired(true) // Make the option required
    )
    .addStringOption(
      (
        option // Add a string option for the duration
      ) =>
        option
          .setName("duration") // Set the option name
          .setRequired(true) // Make the option required
          .setDescription("The duration of the timeout") // Set the option description
          .addChoices(
            { name: "60 Secs", value: "60" },
            { name: "2 Minutes", value: "120" },
            { name: "5 Minutes", value: "300" },
            { name: "10 Minutes", value: "600" },
            { name: "15 Minutes", value: "900" },
            { name: "20 Minutes", value: "1200" },
            { name: "30 Minutes", value: "1800" },
            { name: "45 Minutes", value: "2700" },
            { name: "1 Hour", value: "3600" },
            { name: "2 Hours", value: "7200" },
            { name: "3 Hours", value: "10800" },
            { name: "5 Hours", value: "18000" },
            { name: "10 Hours", value: "36000" },
            { name: "1 Day", value: "86400" },
            { name: "2 Days", value: "172800" },
            { name: "3 Days", value: "259200" },
            { name: "5 Days", value: "432000" },
            { name: "One Week", value: "604800" }
          )
    )
    .addStringOption(
      (
        option // Add a string option for the reason
      ) =>
        option
          .setName("reason") // Set the option name
          .setDescription("The reason for timing out the user") // Set the option description
          .setRequired(true) // Make the option required
    ),
  async execute(interaction) {
    // Get the target user, duration, and reason from the command options
    const timeUser = interaction.options.getUser("target");
    const timeMember = await interaction.guild.members.fetch(timeUser.id);
    const duration = interaction.options.getString("duration");
    const user = interaction.user;

    // Create an embed for error messages if the user does not have permission
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to timeout members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Check if the user has administrator permissions
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      // If not, reply with the error embed and return
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    // Check if the target user is in the server
    if (!timeMember)
      return await interaction.reply({
        content: "The user mentioned is no longer within the server.",
        ephemeral: true,
      });
    // Check if the bot can timeout the user
    if (!timeMember.kickable)
      return interaction.reply({
        content:
          "I cannot timeout this user! This is either because their higher then me or you.",
        ephemeral: true,
      });
    // Check if a valid duration is set
    if (!duration)
      return interaction.reply({
        content: "You must set a valid duration for the timeout",
        ephemeral: true,
      });
    // Check if the user is trying to timeout themselves
    if (interaction.member.id === timeMember.id)
      return interaction.reply({
        content: "You cannot timeout yourself!",
        ephemeral: true,
      });
    // Check if the user is trying to timeout a staff member
    if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({
        content:
          "You cannot timeout staff members or people with the Administrator permission!",
        ephemeral: true,
      });

    // Get the reason for the timeout
    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason given.";

    // Timeout the user
    await timeMember.timeout(duration * 1000, reason);

    // Create an embed to confirm the timeout
    const minEmbed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`${timeUser.tag} timed out`)
      .setDescription(
        `**${timeUser.tag}** has been **timed out** for **${
          duration / 60
        }** minutes in ${interaction.guild.name} \n **Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Create an embed to notify the user they have been timed out
    const dmEmbed = new EmbedBuilder()
      .setTitle("You have been timed out")
      .setDescription(
        `You have been timed out in **${interaction.guild.name}** for **${
          duration / 60
        }** minutes in ${interaction.guild.name} \n **Reason:** ${reason}`
      )
      .setColor("DarkButNotBlack")
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Send the notification to the user
    await timeMember.send({ embeds: [dmEmbed] }).catch((err) => {
      return;
    });

    // Reply to the interaction with the confirmation embed
    await interaction.reply({ embeds: [minEmbed] });
  },
};
