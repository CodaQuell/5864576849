const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Modlog = require('../../schemas/mog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlog-disable')
        .setDescription('Disables the mod log channel for this server.'),
        async execute(interaction) {
            const guildId = interaction.guild.id;
        
            const perm = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle('Error')
            .setDescription(`You don't have permission to disable the moderation logging channel in this server`)
            .setTimestamp()
            .setFooter({ text: `Alto Moderation Logging System`})
    
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
     
        
            try {
                const modlog = await Modlog.findOne({ guildId });
                if (!modlog) {
                    return interaction.reply({ content: 'Mod log channel has not been set up yet.', ephemeral: true });
                }
        
                await Modlog.findOneAndDelete({ guildId });
        
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Your Mod Log channel has been disabled. \n To turn on this feature run the command \`/modlog-setup\``).setColor("DarkButNotBlack").setTimestamp().setFooter({ text: `Alto Moderation Logging System`})] })
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: 'An error occurred while disabling the mod log channel', ephemeral: true});
            }
        },
};