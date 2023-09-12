const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-notes")
    .setDescription("Removes notes on a user")
    .addUserOption((option) => option.setName("user").setDescription("The user you want to remove notes on").setRequired(true)),
 
  async execute(interaction) {

    const author = interaction.user;
    const user = interaction.options.getUser("user");
    
    const perm = new EmbedBuilder()
    .setColor('DarkButNotBlack')
    .setTitle('Error')
    .setDescription(`You don't have permission to add notes in this server`)
    .setTimestamp()
    .setFooter({ text: 'Alto Community System'})
 
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendMessages)) return await interaction.reply({ embeds: [perm], ephemeral: true });
      //if people are abusing this command change perms to adminstator
 
 
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
      await db.delete(`note_${user}_${interaction.guild.id}`);
 
      const embed = new EmbedBuilder()
      .setColor('DarkButNotBlack')
        .setDescription(`Removed "${remuser}" from ${user}.`)
        .setTitle(`Removed notes on ${user.tag}`)
        .setTimestamp()
        .setFooter({ text: 'Alto Community System'})
 
      await interaction.reply({ embeds: [embed] });
    }
  },
};        