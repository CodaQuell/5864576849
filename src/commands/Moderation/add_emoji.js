const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-moji")
    .setDescription("Add a given emoji to the server")
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("The emoji you want to add to the server")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name for your emoji")
        .setRequired(true)
    ),
  async execute(interaction) {
    const perm = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`You don't have permission to add emojis in this server`)
      .setTimestamp()
      .setFooter({ text: `Alto Moderation System` });

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({ embeds: [perm], ephemeral: true });

    let emoji = interaction.options.getString("emoji")?.trim();
    const name = interaction.options.getString("name");

    if (emoji.startsWith("<") && emoji.endsWith(">")) {
      const id = emoji.match(/\d{15,}/g)[0];

      const type = await axios
        .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then((image) => {
          if (image) return "gif";
          else return "png";
        })
        .catch((err) => {
          return "png";
        });

      emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
    }

    if (!emoji.startsWith("http")) {
      return await interaction.reply({
        content: "You cannot add default emojis!",
        ephemeral: true,
      });
    }

    if (!emoji.startsWith("https")) {
      return await interaction.reply({
        content: "You cannot add default emojis!",
        ephemeral: true,
      });
    }

    interaction.guild.emojis
      .create({ attachment: `${emoji}`, name: `${name}` })
      .then((emoji) => {
        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Added Emoji!")
          .setDescription(`Added ${emoji}, with the name ${name}`)
          .setTimestamp()
          .setFooter({ text: `Alto Moderation System` });

        return interaction.reply({ embeds: [embed] });
      })
      .catch((err) => {
        interaction.reply({
          content:
            "You cannot add this emoji because you have reached your server emoji limit",
          ephemeral: true,
        });
      });
  },
};
