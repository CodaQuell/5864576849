const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const levelSchema = require("../../schemas/level");
const Canvacord = require(`canvacord`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Gets a members level/rank")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription(`The member you want to check the rank of`)
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const { options, user, guild } = interaction;

    const Member = options.getMember("user") || user;
    const member = guild.members.cache.get(Member.id);

    const Data = await levelSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`${member} has not gained any XP yet.`)
      .setTimestamp()
      .setFooter({ text: `Alto Leveling System` });
    if (!Data) return await interaction.reply({ embeds: [embed] });

    await interaction.deferReply();

    const Required = Data.Level * Data.Level * 20 + 20;

    const rank = new Canvacord.Rank()
      .setAvatar(member.displayAvatarURL({ forceStatic: true }))
      .setBackground(
        "IMAGE",
        "https://cdn.discordapp.com/attachments/1106166597695045634/1106166633984167986/d51596df-1528-463f-945b-0d86bb70fa85.jpg"
      )
      .setCurrentXP(Data.XP)
      .setRequiredXP(Required)
      .setRank(1, "Rank", false)
      .setLevel(Data.Level, "Level")
      .setProgressBar("AQUA", "COLOR")
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);

    const Card = await rank.build();

    const attachment = new AttachmentBuilder(Card, { name: "rank.png" });

    const embed2 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`${member.user.username}'s Rank Card`)
      .setImage("attachment://rank.png")
      .setTimestamp()
      .setFooter({
        text: `Alto Leveling System • ${member.user.username}'s Rank Card`,
      });

    await interaction.editReply({ embeds: [embed2], files: [attachment] });
  },
};
