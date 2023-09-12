const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-role")
    .setDescription("Remove roles from members")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select a member to remove a role from")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Select the role to remove from the member")
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
        `You don't have permission to remove roles to members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    member.roles.remove(role);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**${role}** roles has been **removed** to **${member}**`
          )
          .setColor("DarkButNotBlack")
          .setTitle("Role Removed!")
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` }),
      ],
    });
  },
};
