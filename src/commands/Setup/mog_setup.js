const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const Modlog = require('../../schemas/mog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmodlog')
        .setDescription('Sets up the mod log channel for this server.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the mod log channel').addChannelTypes(ChannelType.GuildText).setRequired(true)),
        async execute(interaction) {
          const guildId = interaction.guild.id;
          const logChannelId = interaction.options.getChannel('channel').id;
          
          const perm = new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setTitle('Error')
          .setDescription(`You don't have permission to setup a moderation logging channel in this server`)
          .setTimestamp()
          .setFooter({ text: `Alto Moderation Logging System`})
  
          if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true })
   
      
          try {
              let modlog = await Modlog.findOne({ guildId });
              if (modlog) {
                  return interaction.reply({ content: 'A mod log channel has already been set up for this server.', ephemeral: true });
              }
              
              modlog = await Modlog.findOneAndUpdate(
                  { guildId },
                  { logChannelId },
                  { upsert: true }
              );
      
              return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Mod log channel set to <#${logChannelId}>. \n To turn off this feature run the command \`/modlog-disable\``).setColor("DarkButNotBlack").setTimestamp().setFooter({ text: `Alto Moderation Logging System`})] })
          } catch (error) {
              console.error(error);
              return interaction.reply('An error occurred while setting up the mod log channel');
          }
      }
 };