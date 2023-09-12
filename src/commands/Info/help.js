const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("This will bring up the Alto Help Centre"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Alto Help Centre")
      .setDescription(
        "This is Alto's Help Centre guide.\n If you want to know more about Alto, run the command /bot-info, or if you want to add Alto to your server, do /invite."
      )
      .addFields(
        { name: "Page 1", value: "Help and resources centre" },
        { name: "Page 2", value: "Community commands" },
        { name: "Page 3", value: "Moderation commands" },
        { name: "Page 4", value: "Setup commands" },
        { name: "Page 5", value: "Levelling commands" },
        {
          name: "About Alto",
          value:
            "Alto has everything your server needs. From Mod Logging to a XP system, and even some fun commands. It has all of the Moderation commands and lots of  Communtiy commands as well.\n If you have any questons feel free to DM codaquell on discord.",
        }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    const embed2 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Commands")
      .addFields(
        {
          name: "/community-commands",
          value:
            "This will bring up the list of commands that everyone can do.",
        },
        {
          name: "/moderation-commands",
          value:
            "This will bring up the list of commands that only moderators can do.",
        }
      )
      .setDescription(
        "Community commands are commands that everyone has access to. \n They mainly consist of commands like **/ping**, or **/user-info**. \n If you want the full list of commands, do **/community-commands**. \n \n Moderation commands are commands that only people with adminstrator have access to. \n They are commands like **/kick**, or **/lockdown**. \n If you want the full list of these commands do** /moderation-commands** \n"
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    const embed3 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Setup Commands")
      .setDescription(
        "Alto has lots of features that are all really easy to setup. These feature inlclude Alto's Mod Loggings system, Welcome Messages, a Report System and Autoroles. \n All of these are really easy to setup and the commands all follow the same principle in that they all start with **/setup**. \n Disabling thses commands is also really easy. It is similar to the setup commands with the fact that they all start with **/disable**. \n Here are some examples:"
      )
      .addFields(
        {
          name: "/modlog setup",
          value: "This will setup your modloging system",
        },
        {
          name: "/modlog disable",
          value: "This will disable your modloging system",
        }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    const embed4 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Levelling commands")
      .setDescription(
        "Levelling commands are commands that are relevant to the xp system. \n These commands can include commands like **/rank**, which brings up a users rank card, or **/xp-reset**, which can reset anyusers xp. \n These commands aren' t all community commands, with come of them being moderator only, like **/xp-reset-all**, or **/xp-reset**"
      )
      .addFields(
        { name: "/rank", value: `This brings up your or any user's rank card` },
        {
          name: "/xp-leaderboard",
          value: "This will show the top 10 users on the server",
        },
        { name: "/xp-reset", value: `resets any user's xp & rank` },
        { name: "/xp-reset-all", value: `resets all server member's xp & rank` }
      )
      .setTimestamp()
      .setFooter({ text: "Alto Help Centre" });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`page1`)
        .setLabel(`Page 1`)
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`page2`)
        .setLabel(`Page 2`)
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`page3`)
        .setLabel(`Page 3`)
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`page4`)
        .setLabel(`Page 4`)
        .setStyle(ButtonStyle.Success)
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [button],
    });
    const collector = await message.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "page1") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.tag} can use these buttons! If you want to read the help menu just run the command /help!`,
            ephemeral: true,
          });
        }
        await i.update({ embeds: [embed], components: [button] });
      }

      if (i.customId === "page2") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.tag} can use these buttons! If you want to read the help menu just run the command /help!`,
            ephemeral: true,
          });
        }
        await i.update({ embeds: [embed2], components: [button] });
      }

      if (i.customId === "page3") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.tag} can use these buttons! If you want to read the help menu just run the command /help!`,
            ephemeral: true,
          });
        }
        await i.update({ embeds: [embed3], components: [button] });
      }

      if (i.customId === "page4") {
        if (i.user.id !== interaction.user.id) {
          return await i.reply({
            content: `Only ${interaction.user.tag} can use these buttons! If you want to read the help menu just run the command /help!`,
            ephemeral: true,
          });
        }
        await i.update({ embeds: [embed4], components: [button] });
      }
    });
  },
};