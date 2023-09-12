const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Make a public note on someone")
    .addUserOption((option) => option.setName("user").setDescription("The user you want to make a note about").setRequired(true))
    .addStringOption((option) => option.setName("note").setDescription("The thing you want me to remember about this person").setRequired(true)),
 
  async execute(interaction) {

    const author = interaction.user;
    const user = interaction.options.getUser("user");
    const description = interaction.options.getString("note");

    const perm = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Error')
    .setDescription(`You don't have permission to add notes in this server`)
    .setTimestamp()
    .setFooter({ text: 'Alto Community System'})
 
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) return await interaction.reply({ embeds: [perm], ephemeral: true });
      //if people are abusing this command change perms to adminstator
  
 
    await db.set(`note_${user}_${interaction.guild.id}`, description);
 
    const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
      .setDescription(`**Made a note on ${user}:** \n **Note:** ${description}`)
      .setTitle("Made Note")
      .setTimestamp()
      .setFooter({ text: 'Alto Community System'})
 
    await interaction.reply({ embeds: [embed] });
  },
};