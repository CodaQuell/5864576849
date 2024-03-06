// Import necessary modules from discord.js library
const {
  PermissionsBitField,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
} = require(`discord.js`);

// Export a module to set up a verification system
module.exports = {
  // Slash command configuration
  data: new SlashCommandBuilder()
    .setName("verify") // Command name
    .setDescription(`Sets up a verification system.`) // Command description
    .addRoleOption((option) =>
      option
        .setName(`role`) // Option for specifying the verification role
        .setDescription(`This is the role to give members post verification.`)
        .setRequired(true)
    ),

  // Execution function for the command
  async execute(interaction) {
    const channel = interaction.channel; // Get the interaction channel
    const role = interaction.options.getRole(`role`); // Get the specified role

    // Embed for the initial verification message
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`Verification`)
      .setDescription(
        `Welcome to ${interaction.guild.name}! \n React below to get verified and gain access to the rest of the server.`
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Embed for permission error message
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to setup a verification in this server members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Check if the user has the necessary permissions
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    // Create a 'Verify' button
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setLabel(`Verify`)
        .setStyle(ButtonStyle.Success)
    );

    // Send the verification message with the button
    await channel.send({ embeds: [embed], components: [button] });

    // Reply to the user confirming the setup
    await interaction.reply({
      content: `Your verification has been setup using the role ${role}`,
      ephemeral: true,
    });

    // Create a collector to listen for button interactions
    const collector =
      await interaction.channel.createMessageComponentCollector();

    // Listen for button click events
    collector.on("collect", async (i) => {
      const member = i.member;

      // Check if bot's role position is lower than the role to be assigned
      if (i.guild.members.me.roles.highest.position < role.position) {
        i.update({
          content:
            "My role is below the role that I'm trying to give; I have shut this reaction role message down.",
          embeds: [],
          components: [],
        });
        return;
      }

      // Check if the clicked button is the 'Verify' button
      if (i.customId === "button") {
        // Add the verification role to the member
        member.roles.add(role);

        // Reply to the member confirming verification
        i.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You have been verified in **${interaction.guild.name}**, you now have access to the rest of the server!`
              )
              .setColor("DarkButNotBlack")
              .setTimestamp()
              .setFooter({ text: `${process.env.serverName}` }),
          ],
          ephemeral: true,
        });
      }
    });
  },
};
