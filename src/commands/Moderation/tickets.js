const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ButtonInteraction,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Use this command to create a ticket message")
    .addChannelOption((option) =>
      option
        .setName("catagory")
        .setDescription("The catagory you want to tickets send to")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const catagory = options.getChannel("catagory");

    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to create tickets in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Ticket System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setEmoji("📩")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Tickets & Support")
      .setDescription(
        `Click the button below to talk to staff (create a ticket)`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Ticket System` });

    interaction.reply({ embeds: [embed], components: [button] });
    const collector =
      await interaction.channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      await i.update({ embeds: [embed], components: [button] });

      const channel = await interaction.guild.channels.create({
        name: `Ticket ${i.user.id}`,
        type: ChannelType.GuildText,
        parent: catagory,
      });

      channel.permissionOverwrites.create(i.user.id, {
        ViewChannel: true,
        SendMessages: true,
      });
      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        ViewChannel: false,
        SendMessages: false,
      });

      const embed2 = new EmbedBuilder()
        .setTitle(`You Ticket`)
        .setColor("DarkButNotBlack")
        .setDescription(
          `Hi there ${i.user} this is your ticket in ${i.guild.name}. \n Only you and ${i.guild.name}'s Moderators can see this ticket. \n You or a Moderator can close this ticket at any time.`
        )
        .addFields(
          {
            name: "Issues with tickets",
            value: `If you have any issues with this ticket feel free to do /report and report the issue to ${i.guild.name} Moderators.`,
          },
          {
            name: "Issues with Alto",
            value: `If it is an issue regarding Alto its self, please concact Coda Quell#4551 on discord.`,
          }
        )
        .setTimestamp()
        .setFooter({ text: `Alto Ticket System` });

      const button2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("button")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Close")
          .setEmoji("🔐")
      );

      const m = await channel.send({ embeds: [embed2], components: [button2] });

      const collector = m.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        if (i.customId == "button") {
          await channel.delete();
          i.user.send({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `Your ticket in ${i.guild.name} has been closed by a moderator. \n If you still have any questions feel free to create a new ticket.`
                )
                .setColor("DarkButNotBlack")
                .setTitle(`Info regarding you ticket in ${i.guild.name}`)
                .setTimestamp()
                .setFooter({ text: "Alto Ticket System" }),
            ],
          });
        }
      });

      m.pin();

      i.user
        .send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Your ticket in ${i.guild.name} has been created. \n You or a Moderator can close this ticket at anytime.`
              )
              .setColor("DarkButNotBlack")
              .setTitle(`Info regarding you ticket in ${i.guild.name}`)
              .setTimestamp()
              .setFooter({ text: "Alto Ticket System" }),
          ],
        })
        .catch((err) => {
          return;
        });
    });
  },
};
