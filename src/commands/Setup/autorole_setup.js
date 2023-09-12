const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole-setup")
    .setDescription("Sets up the Autorole system")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want members to get when they join.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to set a autorole in this server members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const role = interaction.options.getRole("role");

    await db.set(`autorole_${interaction.guild.id}`, role.id);

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Auto Role Set!")
      .setDescription(
        `Your server's auto role has been set to ${role}.\n To turn off this feature run the command \`/autorole-disable\``
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    await interaction.reply({ embeds: [embed] });
  },
};
