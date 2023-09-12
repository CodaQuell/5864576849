const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("notes")
    .setDescription("See the notes for each user")
    .addUserOption((option) => option.setName("user").setDescription("The user you want to view the notes of").setRequired(true)),
 
  async execute(interaction) {
    const user = interaction.options.getUser("user");
 
    const remuser = await db.get(`note_${user}_${interaction.guild.id}`);
 
    if (remuser == null) {
      const embed1 = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setTitle('Error')
      .setDescription(`There is not any notes on ${user}`)
      .setTimestamp()
      .setFooter({ text: 'Alto Community System'})
 
      await interaction.reply({ embeds: [embed1], ephemeral: true });
    } else {
      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
        .setDescription(`Here are the notes on ${user} \n **Notes:** ${remuser}`)
        .setTitle(`Notes on ${user.tag}`)
        .setTimestamp()
        .setFooter({ text: 'Alto Community System'})
 
      await interaction.reply({ embeds: [embed] });
    }
  },
};