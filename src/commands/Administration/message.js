// Import necessary modules from discord.js library
const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");

// Create a set to manage cooldown for commands
const cooldown = new Set();

// Export a module with a slash command to send a message to a server member
module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("DMs a server member!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to message")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to send.")
        .setRequired(true)
    ),

  // Execute function to handle command execution
  async execute(interaction, message, client) {
    const cT = 60; // Cooldown time in seconds

    // Check if the user is on cooldown
    if (cooldown.has(interaction.author)) {
      // Respond with a cooldown message
      interaction.reply({
        content: `You are on a message cooldown! Try again in ${cT} seconds`,
        ephemeral: true,
      });
    } else {
      // Retrieve necessary information
      const dmUser = interaction.options.getUser("target");
      const dmMember = await interaction.guild.members.fetch(dmUser.id);
      const channel = interaction.channel;
      const user = interaction.options.getUser("user") || interaction.user;

      // Create an embed for permission error message
      const perm = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Error")
        .setDescription(
          `You don't have permission to message members in this server`
        )
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Check if the user has necessary permissions
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return await interaction.reply({ embeds: [perm], ephemeral: true });

      // Check if the mentioned user is still in the server
      if (!dmMember)
        return await interaction.reply({
          content: "The user mentioned is no longer within the server.",
          ephemeral: true,
        });

      // Get the message to be sent
      let message = interaction.options.getString("message");
      if (!message)
        return await interaction.reply(
          "You must type a message to send to this user!"
        );

      // Send a direct message to the mentioned user
      await dmMember
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Message from ${interaction.guild.name}`)
              .setDescription(
                `**${interaction.guild.name}'s moderation team have sent you this message:**`
              )
              .addFields({ name: "**Message:**", value: `${message}` })
              .setColor("DarkButNotBlack")
              .setTimestamp()
              .setFooter({
                text: `Name: ${interaction.guild.name}  ID: ${interaction.guild.id}`,
              }),
          ],
        })
        .catch((err) => {
          return interaction.reply({
            content: "I cannot message the message to this user",
            ephemeral: true,
          });
        });

      // Create an embed confirming the sent message
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Message sent")
        .setDescription(`Sent **${dmUser.tag}** "${message}"`)
        .setFooter({ text: `${user.tag}` })
        .setTimestamp();

      // Respond with a confirmation embed
      await interaction.reply({ embeds: [embed], ephemeral: true });

      // Apply cooldown for the user
      cooldown.add(interaction.author);
      setTimeout(() => {
        cooldown.delete(interaction.author);
      }, cT * 1000); // Remove user from cooldown after specified time
    }
  },
};
