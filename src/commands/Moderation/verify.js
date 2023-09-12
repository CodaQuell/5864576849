const {
  PermissionsBitField,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  ChannelType,
} = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription(`Sets up a verification system.`)
    .addRoleOption((option) =>
      option
        .setName(`role`)
        .setDescription(`This is the role to give members post verification.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const role = interaction.options.getRole(`role`);

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`Verification`)
      .setDescription(
        `Welcome to ${interaction.guild.name}! \n React below to get verified and gain access to the rest of the server.`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to setup a verification in this server members in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setLabel(`Verify`)
        .setStyle(ButtonStyle.Success)
    );

    await channel.send({ embeds: [embed], components: [button] });
    await interaction.reply({
      content: `Your verification has been setup using the role ${role}`,
      ephemeral: true,
    });

    const collector =
      await interaction.channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const member = i.member;

      if (i.guild.members.me.roles.highest.position < role.position) {
        i.update({
          content:
            "My role is below the role that I'm trying to give; I have shut this reaction role message down.",
          embeds: [],
          components: [],
        });
        return;
      }
      if (i.customId === "button") {
        member.roles.add(role);
        i.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You have been verified in **${interaction.guild.name}**, you now have access to the rest of the server!`
              )
              .setColor("DarkButNotBlack")
              .setTimestamp()
              .setFooter({ text: `Alto Moderation System` }),
          ],
          ephemeral: true,
        });
      }
    });
  },
};
