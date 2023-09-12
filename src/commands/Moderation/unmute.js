const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB;
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmute a muted member')
        .addUserOption(option => option.setName('member').setDescription('Select a member to mute').setRequired(true)),
    async execute(interaction) {
        
        const user = interaction.user;
        const member = interaction.options.getMember('member');
        const muteMember = await interaction.guild.members.fetch(member.id)
        const role = await db.get(`muterole_${interaction.guild.id}`)

        const perm = new EmbedBuilder()
        .setColor('DarkButNotBlack')
        .setTitle('Error')
        .setDescription(`You don't have permission to unmute members in this server`)
        .setTimestamp()
        .setFooter({ text: `Alto Moderation System`})

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
 
        if (role == null) {
            const embed1 = new EmbedBuilder()
              .setColor('DarkButNotBlack')
              .setDescription(`There isn't a mute role setup. \n do \`/muterole-setup\` to set one up.`)
              .setTitle("Error")
              .setTimestamp()
              .setFooter({ text: `Alto Moderation System`})
      
          
            await interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
              .setColor('DarkButNotBlack')
              .setDescription(`${member} has been un-muted by ${user}`)
              .setTitle(`User un-muted`)
              .setTimestamp()
              .setFooter({ text: `Alto Moderation System`})
      
          
            await interaction.reply({ embeds: [embed] });
          
            member.roles.remove(role);

            const dmEmbed = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle('You have been un-muted')
            .setDescription(`You have been un-muted in ${interaction.guild.name} a moderator`)
            .setTimestamp()
            .setFooter({ text: `Alto Moderation System`})
            
            await muteMember.send({ embeds: [dmEmbed]}).catch(err => {
                return;
            })
        }
        
    }
}
