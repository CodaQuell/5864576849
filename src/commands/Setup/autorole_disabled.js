const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole-disable")
    .setDescription("Sets up the Autorole system"),
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

    await db.delete(`autorole_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Auto Role Disabled!")
      .setDescription(
        `Your Autorole has been disabled.\n To turn on this feature run the command \`/autorole-setup\``
      )
      .setTimestamp()
      .setFooter({ text: "Autorole System" });

    await interaction.reply({ embeds: [embed] });
  },
};
