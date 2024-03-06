// Import necessary classes from discord.js, a schema for leveling, and Canvacord for creating rank cards
const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
} = require("discord.js");
const levelSchema = require("../../Schemas/level_schema");
const Canvacord = require(`canvacord`);

// Export an object with command data and an execute function
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank") // Set the command name
    .setDescription("Gets a members level/rank") // Set the command description
    .addUserOption(
      (
        option // Add a user option for selecting a user
      ) =>
        option
          .setName("user") // Set the option name
          .setDescription(`The member you want to check the rank of`) // Set the option description
          .setRequired(false) // Make the option optional
    ),
  async execute(interaction, client) {
    const { options, user, guild } = interaction;

    // Get the selected user from the command options, or the user who invoked the command if no user is specified
    const Member = options.getMember("user") || user;
    // Fetch the member object for the selected user
    const member = guild.members.cache.get(Member.id);

    // Find the user's level data in the database
    const Data = await levelSchema.findOne({
      Guild: guild.id,
      User: member.id,
    });

    // Create an embed for error messages if the user has not gained any XP yet
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("Error")
      .setDescription(`${member} has not gained any XP yet.`)
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });
    // If the user has no level data, reply with the error embed and return
    if (!Data) return await interaction.reply({ embeds: [embed] });

    // Defer the reply to the interaction
    await interaction.deferReply();

    // Calculate the required XP for the next level
    const Required = Data.Level * Data.Level * 20 + 20;

    // Create a rank card using Canvacord
    const rank = new Canvacord.Rank()
      .setAvatar(member.displayAvatarURL({ forceStatic: true })) // Set the user's avatar
      .setBackground(
        "IMAGE",
        "https://cdn.discordapp.com/attachments/1106166597695045634/1106166633984167986/d51596df-1528-463f-945b-0d86bb70fa85.jpg" // Set the background image
      )
      .setCurrentXP(Data.XP) // Set the user's current XP
      .setRequiredXP(Required) // Set the XP required for the next level
      .setLevel(Data.Level, "Level") // Set the user's level
      .setRank(1, "Rank", false) // Set the user's rank
      .setProgressBar("AQUA", "COLOR") // Set the progress bar color
      .setUsername(member.user.displayName); // Set the user's display name

    // Build the rank card
    const Card = await rank.build();

    // Create an attachment from the rank card
    const attachment = new AttachmentBuilder(Card, { name: "rank.png" });

    // Create an embed to display the rank card
    const embed2 = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle(`${member.user.username}'s Rank Card`) // Set the title to the user's username
      .setImage("attachment://rank.png") // Set the image to the rank card
      .setTimestamp() // Set the timestamp to the current time
      .setFooter({
        text: `Alto Leveling System • ${member.user.username}'s Rank Card`, // Set the footer to the user's username
      });

    // Edit the deferred reply with the rank card embed and attachment
    await interaction.editReply({ embeds: [embed2], files: [attachment] });
  },
};
