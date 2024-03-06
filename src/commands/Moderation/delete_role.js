const { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-role")
        .setDescription("deletes selected role")
        .addRoleOption(option => option.setName("role").setDescription("the role you want to delete").setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, user } = interaction;

        // Get the role to delete from the command options
        const deleterole = interaction.options.getRole(`role`);

        // Create an embed for error messages if the user does not have permission
        const perm = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle('Error')
            .setDescription(`You don't have permission to delete roles in this server`)
            .setTimestamp()
            .setFooter({ text: `${process.env.serverName}` });

        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return await interaction.reply({ embeds: [perm], ephemeral: true });

        // Attempt to delete the role
        await guild.roles.delete(deleterole.id) // Corrected: Pass the role ID to delete()
            .catch(error => {
                console.error(error); // Log any errors that occur during deletion
                return interaction.reply({ content: "There was an error deleting the role!", ephemeral: true });
            });

        // Create an embed to confirm the role deletion
        const embed = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle('Role Deleted')
            .setDescription(`The role ${deleterole.name} has been deleted by ${user.tag}`)
            .setTimestamp()
            .setFooter({ text: `${process.env.serverName}` });

        // Reply to the interaction with the confirmation embed
        await interaction.reply({embeds: [embed]});
    }
}
