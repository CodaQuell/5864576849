// Import necessary modules from discord.js library
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

// Export a module for the 8ball game command
module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("8ball") // Command name
    .setDescription(`This is the 8ball game`) // Command description
    .addStringOption((option) =>
      option
        .setName("question") // Option for asking a question
        .setDescription(`This will be your question for the 8ball`)
        .setRequired(true)
    ),

  // Execution function for the command
  async execute(interaction) {
    const { options } = interaction;

    const question = options.getString("question"); // Get the user's question
    const choice = [ // Array of possible 8ball responses
      "🎱| It is certain.",
      "🎱| It is decidedly so.",
      "🎱| Yes.",
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
      "🎱| No.",
    ];

    // Generate a random response from the choice array
    const ball = Math.floor(Math.random() * choice.length);

    // Embed for the initial 8ball question message
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`${interaction.user.username}'s 8ball game`)
      .addFields({ name: "Question", value: `${question}`, inline: true })
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Embed for the 8ball response message
    const embed2 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`🎱| ${interaction.user.username}'s 8ball game`)
      .addFields({ name: "Question", value: `${question}`, inline: true })
      .addFields({ name: "Answer", value: `${choice[ball]}`, inline: true })
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Create a 'Roll the ball!' button
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setLabel(`🎱 Roll the ball!`)
        .setStyle(ButtonStyle.Primary)
    );

    // Reply with the initial question and button
    const msg = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    // Create a collector to listen for button interactions
    const collector = msg.createMessageComponentCollector();

    // Listen for button click events
    collector.on("collect", async (i) => {
      if (i.customId == "button") {
        // Update the message to show the 8ball response and remove the button
        i.update({ embeds: [embed2], components: [] });
      }
    });
  },
};
