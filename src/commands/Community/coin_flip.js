const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flip")
        .setDescription("This flips a coin. Heads or Tails."),

    async execute(interaction) {
        // Array containing the choices 'Heads' and 'Tails'
        const choices = ["Heads", "Tails"];
        // Randomly select one of the choices
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];

        // Reply to the interaction with the result of the coin flip
        await interaction.reply({ content: `It landed on.... **${randomChoice}** :coin:` });
    }
};
