const {
  PermissionsBitField,
  EmbedBuilder,
  ChannelType,
  SlashCommandBuilder,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Sends a message to the selected channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("channel you want to push this message to")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("embed description")
        .setRequired(true)
    ),

  async execute(interaction) {
    const message = interaction.options.getString("message");
    const channel = interaction.options.getChannel("channel");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to /say in this server`)
      .setTimestamp()
      .setFooter({ text: "Alto Community System" });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.SendMessages
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });
    //if people are abusing this command change perms to adminstator

    await interaction.reply({
      content: `Sent message *${message}*`,
      ephemeral: true,
    });

    channel.send({ content: `${message}` });
  },
};
