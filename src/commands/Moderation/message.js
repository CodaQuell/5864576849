const {
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} = require("discord.js");
const cooldown = new Set();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("msg")
    .setDescription("DMs a server member!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you would like to message")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to send.")
        .setRequired(true)
    ),
  async execute(interaction, message, client) {
    const cT = 60;
    if (cooldown.has(interaction.author)) {
      interaction.reply({
        content: `You are on a message cooldown! Try again in ${cT} seconds`,
        ephemeral: true,
      });
    } else {
      const dmUser = interaction.options.getUser("target");
      const dmMember = await interaction.guild.members.fetch(dmUser.id);
      const channel = interaction.channel;
      const user = interaction.options.getUser("user") || interaction.user;

      const perm = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Error")
        .setDescription(
          `You don't have permission to message members in this server`
        )
        .setTimestamp()
        .setFooter({ text: `Alto Moderation System` });

      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return await interaction.reply({ embeds: [perm], ephemeral: true });

      if (!dmMember)
        return await interaction.reply({
          content: "The user mentioned is no longer within the server.",
          ephemeral: true,
        });

      let message = interaction.options.getString("message");
      if (!message)
        return await interaction.reply(
          "You must type a message to send to this user!"
        );

      await dmMember
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Message from ${interaction.guild.name}`)
              .setDescription(
                `**${interaction.guild.name}'s moderation team have send you this message:**`
              )
              .addFields({ name: "**Message:**", value: `${message}` })
              .setColor("DarkButNotBlack")
              .setTimestamp()
              .setFooter({
                text: `Name: ${interaction.guild.name}  ID: ${interaction.guild.id}`,
              }),
          ],
        })
        .catch((err) => {
          return interaction.reply({
            content: "I cannot message the message to this user",
            ephemeral: true,
          });
        });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Message sent")
        .setDescription(`Sent **${dmUser.tag}** "${message}"`)
        .setFooter({ text: `${user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      cooldown.add(interaction.author);
      setTimeout(() => {
        cooldown.delete(interaction.author);
      }, cT * 1000);
    }
  },
};
