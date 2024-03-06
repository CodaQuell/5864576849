const {
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  SlashCommandBuilder,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say") // Command name
    .setDescription("Sends a message to the selected channel") // Command description
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel you want to push this message to")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Embed description")
        .setRequired(true)
    ),

  // Execution function for the command
  async execute(interaction) {
    const message = interaction.options.getString("message"); // Get the message to send
    const channel = interaction.options.getChannel("channel"); // Get the specified channel

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to /say in this server`)
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.SendMessages
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });
    // Check if the user has permission to send messages (can be changed to Administrator if needed for restriction)

    await interaction.reply({
      content: `Sent message *${message}*`, // Respond with a confirmation message
      ephemeral: true,
    });

    channel.send({ content: `${message}` }); // Send the message to the specified channel
  },
};
