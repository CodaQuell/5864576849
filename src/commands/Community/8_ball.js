const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription(`This is the 8ball game`)
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription(`This will be your question for the 8ball`)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;

    const question = options.getString("question");
    const choice = [
      "🎱| It is certian.",
      "🎱| It is decidedly so.",
      "🎱| Yes",
      "🎱| Without a doubt.",
      "🎱| Yes definitely.",
      "🎱| You may rely on it.",
      "🎱| As I see it, yes.",
      "🎱| Most likely.",
      "🎱| Yes.",
      "🎱| Signs point to yes.",
      "🎱| Ask your dad, oh wait you don't have...",
      "🎱| Don't count on it.",
      "🎱| My reply is no.",
      "🎱| My sources say no.",
      "🎱| Outlook not so good.",
      "🎱| Very doubtful.",
      "🎱| No",
      "🎱| Thea, go talk to a real human",
    ];
    const ball = Math.floor(Math.random() * choice.length);

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`${interaction.user.username}'s 8ball game`)
      .addFields({ name: "Question", value: `${question}`, inline: true })
      .setTimestamp()
      .setFooter({ text: "Alto Community System" });

    const embed2 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`🎱| ${interaction.user.username}'s 8ball game`)
      .addFields({ name: "Question", value: `${question}`, inline: true })
      .addFields({ name: "Answer", value: `${choice[ball]}`, inline: true })
      .setTimestamp()
      .setFooter({ text: "Alto Community System" });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setLabel(`🎱 Roll the ball!`)
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId == "button") {
        i.update({ embeds: [embed2], components: [] });
      }
    });
  },
};
