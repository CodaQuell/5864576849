const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nick") // Command name
    .setDescription("Changes a user's nickname in the server.") // Command description
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to change the nickname of.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("The nickname to set to the user.")
        .setRequired(true)
    ),

  // Execution function for the command
  async execute(interaction, client) {
    const user = interaction.options.getUser("user"); // Get the specified user
    const member = await interaction.guild.members.fetch(user.id); // Fetch the member
    const nickname = interaction.options.getString("nickname"); // Get the provided nickname

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to change nicknames in this server`)
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });
    // Check if the user invoking the command has Administrator permissions

    if (nickname.length > 32) {
      return interaction.reply({
        content: `Please make sure the provided nickname is under 32 characters!`,
      });
    }

    member.setNickname(nickname); // Set the user's nickname
    const embed = new EmbedBuilder()
      .setTitle(`Nickname Changed`)
      .setDescription(
        `${member.user.username}'s nickname was changed to \`${nickname}\`!`
      )
      .setColor("DarkButNotBlack")
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    interaction.reply({ embeds: [embed] }); // Reply with a confirmation message
  },
};
