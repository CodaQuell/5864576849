const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const levelSchema = require(`../../schemas/level`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp-server-reset")
    .setDescription("Resets ALL of the server members xp & levels")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription(`The reason for reseting this user's XP`)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason given.";

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to reset xp levels in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Leveling System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const { guildId } = interaction;

    const embed = new EmbedBuilder();

    levelSchema.deleteMany({ Guild: guildId }, async (err, data) => {
      embed
        .setColor("DarkButNotBlack")
        .setTitle("Success")
        .setDescription(
          `The xp system in your server has been reset. \n **Reason:** ${reason}`
        )
        .setTimestamp()
        .setFooter({ text: `Alto Leveling System` });

      return interaction.reply({ embeds: [embed] });
    });
  },
};
