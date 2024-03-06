// Import necessary classes from discord.js
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

// Export an object with command data and an execute function
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket") // Set the command name
    .setDescription("Use this command to create a ticket message") // Set the command description
    .addChannelOption(
      (
        option // Add a channel option for selecting a category
      ) =>
        option
          .setName("catagory") // Set the option name
          .setDescription("The catagory you want to tickets send to") // Set the option description
          .addChannelTypes(ChannelType.GuildCategory) // Restrict the option to guild categories
          .setRequired(true) // Make the option required
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const catagory = options.getChannel("catagory"); // Get the selected category

    // Create an embed for error messages
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(
        `You don't have permission to create tickets in this server`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Ticket System` });

    // Check if the user has administrator permissions
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      // If not, reply with the error embed
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    // Create a button for creating a ticket
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("button")
        .setEmoji("📩")
        .setLabel("Create Ticket")
        .setStyle(ButtonStyle.Secondary)
    );

    // Create an embed for the ticket message
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Tickets & Support")
      .setDescription(
        `Click the button below to talk to staff (create a ticket)`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Ticket System` });

    // Reply with the ticket message and button
    interaction.reply({ embeds: [embed], components: [button] });

    // Create a message component collector to listen for button clicks
    const collector =
      await interaction.channel.createMessageComponentCollector();

    // Handle button clicks
    collector.on("collect", async (i) => {
      // Update the message with the ticket message and button
      await i.update({ embeds: [embed], components: [button] });

      // Create a new text channel for the ticket
      const channel = await interaction.guild.channels.create({
        name: `Ticket ${i.user.id}`,
        type: ChannelType.GuildText,
        parent: catagory, // Set the category of the ticket channel
      });

      // Set permissions for the ticket channel
      channel.permissionOverwrites.create(i.user.id, {
        ViewChannel: true,
        SendMessages: true,
      });
      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        ViewChannel: false,
        SendMessages: false,
      });

      // Create an embed for the ticket channel
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

      // Create a button for closing the ticket
      const button2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("button")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Close")
          .setEmoji("🔐")
      );

      // Send the ticket channel message with the embed and button
      const m = await channel.send({ embeds: [embed2], components: [button2] });

      // Create a message component collector for the ticket channel
      const collector = m.createMessageComponentCollector();
      collector.on("collect", async (i) => {
        // Handle button clicks to close the ticket
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
                .setFooter({ text: `${process.env.serverName}` }),
            ],
          });
        }
      });

      // Pin the ticket channel message
      m.pin();

      // Send a DM to the user with information about their ticket
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
              .setFooter({ text: `${process.env.serverName}` }),
          ],
        })
        .catch((err) => {
          return;
        });
    });
  },
};
