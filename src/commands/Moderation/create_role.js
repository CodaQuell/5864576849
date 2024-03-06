const { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-role")
        .setDescription("creates a role")
        .addStringOption(option => option.setName("name").setDescription("The roles name").setRequired(true))
        .addStringOption(option => option.setName("color").setDescription("The roles color (hex)")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, user } = interaction;

        // Get the role name and color from the command options
        const name = options.getString('name');
        const color = options.getString('color');

        // Create an embed for error messages if the user does not have permission
        const perm = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle('Error')
            .setDescription(`You don't have permission to create roles in this server`)
            .setTimestamp()
            .setFooter({ text: `${process.env.serverName}` });

        // Check if the user has administrator permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return await interaction.reply({ embeds: [perm], ephemeral: true });

        // Attempt to create the role
        await guild.roles.create({ name: name, color: color })
            .then(role => {
                // Create an embed to confirm the role creation
                const embed = new EmbedBuilder()
                    .setColor('DarkButNotBlack')
                    .setTitle('Role Created')
                    .setDescription(`The role ${role.name} has been created by ${user.tag}`)
                    .setTimestamp()
                    .setFooter({ text: `${process.env.serverName}` });

                // Reply to the interaction with the confirmation embed
                interaction.reply({embeds: [embed]});
            })
            .catch(error => {
                console.error(error); // Log any errors that occur during creation
                return interaction.reply({ content: "There was an error creating the role!", ephemeral: true });
            });
    }
}
