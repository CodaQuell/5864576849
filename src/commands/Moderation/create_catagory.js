const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
data: new SlashCommandBuilder()
  .setName("create-category")
  .setDescription("creates a category")
  .addStringOption((option) =>
    option.setName("name").setDescription("The category's name").setRequired(true)
  ),
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
async execute(interaction) {
  const { options, guild, user } = interaction;

  // Get the category name from the command options
  const name = options.getString("name");

  // Create an embed for error messages if the user does not have permission
  const perm = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Error")
    .setDescription(
      `You don't have permission to create categories in this server`
    )
    .setTimestamp()
    .setFooter({ text: `${process.env.serverName}` });

  // Check if the user has administrator permissions
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
  )
    return await interaction.reply({ embeds: [perm], ephemeral: true });

  // Attempt to create the category
  await guild.channels.create({
    name: name,
    type: ChannelType.GuildCategory,
  })
  .then(category => {
    // Create an embed to confirm the category creation
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Category Created!")
      .setDescription(`The category ${category.name} has been created by ${user.tag}`)
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Reply to the interaction with the confirmation embed
    interaction.reply({ embeds: [embed] });
  })
  .catch(error => {
    console.error(error); // Log any errors that occur during creation
    return interaction.reply({ content: "There was an error creating the category!", ephemeral: true });
  });
},
};
