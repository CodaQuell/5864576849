const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((options) =>
      options.setName("user").setDescription("The user's avatar you want")
    ),

  async execute(interaction) {
    let user = interaction.options.getUser("user") || interaction.member;
    let userAvatar = user.displayAvatarURL({ size: 512 });

    const embed = new EmbedBuilder()
      .setImage(`${userAvatar}`)
      .setDescription(`${user}'s Avatar`)
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: "Alto Community System" });

    await interaction.reply({ embeds: [embed] });
  },
};
