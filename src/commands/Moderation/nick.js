const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Changes a user's nickname in the server.")
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
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);
    const nickname = interaction.options.getString("nickname");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to ban members in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });
    //if users are not using this properly just change from send messages to adminstator

    if (nickname.length > 32) {
      return interaction.reply({
        content: `Please make sure the provided nickname is under 32 characters!`,
      });
    }

    member.setNickname(nickname);
    const embed = new EmbedBuilder()
      .setTitle(`Nickname Changed`)
      .setDescription(
        `${member.user.username}'s nickname was changed to \`${nickname}\`!`
      )
      .setColor("DarkButNotBlack")
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    interaction.reply({ embeds: [embed] });
  },
};
