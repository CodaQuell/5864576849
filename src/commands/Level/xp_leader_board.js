const {
  EmbedBuilder,
  DiscordAPIError,
  SlashCommandBuilder,
} = require("discord.js");
const levelSchema = require(`../../schemas/level`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp-leaderboard")
    .setDescription("This gets a servers xp leaderboard"),
  async execute(interaction) {
    const { guild, client } = interaction;

    let text = "";

    const embed1 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`No one is on the leaderboard yet`)
      .setTimestamp()
      .setFooter({ text: `Alto Leveling System` });

    const Data = await levelSchema
      .find({ Guild: guild.id })
      .sort({
        XP: -1,
        Level: -1,
      })
      .limit(10);

    if (!Data) return await interaction.reply({ embeds: [embed1] });

    await interaction.deferReply();

    for (let counter = 0; counter < Data.length; ++counter) {
      let { User, XP, Level } = Data[counter];

      const value = (await client.users.fetch(User)) || "Unknown Member";

      const member = value.tag;

      text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`;

      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
        .setDescription(`\`\`\`${text}\`\`\``)
        .setTimestamp()
        .setFooter({ text: `Alto Leveling System` });

      interaction.editReply({ embeds: [embed] });
    }
  },
};
