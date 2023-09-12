const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const levelSchema = require(`../../schemas/level`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp-reset")
    .setDescription("Resets a server members XP & rank")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(`The user you want to reset the XP of`)
        .setRequired(true)
    )
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
        `You don't have permission to reset XP levels in this server`
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
    const target = interaction.options.getUser("user");
    const embed = new EmbedBuilder();

    levelSchema.deleteMany(
      { Guild: guildId, User: target.id },
      async (err, data) => {
        embed
          .setColor("DarkButNotBlack")
          .setDescription(
            `**${target.tag}'s** XP has been reset. \n **Reason:** ${reason}`
          )
          .setTimestamp()
          .setFooter({ text: `Alto Leveling System` });

        return interaction.reply({ embeds: [embed] });
      }
    );
  },
};
