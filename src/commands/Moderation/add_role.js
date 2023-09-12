const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-role")
    .setDescription("Give roles to members")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select a member to assign a role to")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select the role to assign to the member")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.user;
    const member = interaction.options.getMember("member");
    const role = interaction.options.getRole("role");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to add roles to members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    member.roles.add(role);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**${role}** roles has been **added** to **${member}**`
          )
          .setColor("DarkButNotBlack")
          .setTitle("Role Added!")
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` }),
      ],
    });
  },
};
