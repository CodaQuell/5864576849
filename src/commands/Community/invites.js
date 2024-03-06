// Import necessary classes from discord.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Export an object with command data and an execute function
module.exports = {
 data: new SlashCommandBuilder()
    .setName("invites") // Set the command name
    .setDescription("Gets a users server invite count.") // Set the command description
    .addUserOption((option) => // Add a user option for selecting a user
      option
        .setName("user") // Set the option name
        .setDescription("The user you want to check invites of") // Set the option description
        .setRequired(true) // Make the option required
    ),
 async execute(interaction, message) {
    // Get the selected user from the command options
    const user = interaction.options.getUser("user");

    // Fetch all invites in the guild
    let invites = await interaction.guild.invites.fetch();
    // Filter invites to only include those created by the selected user
    let userInv = invites.filter((u) => u.inviter && u.inviter.id === user.id);

    // Initialize a counter for the total number of invites
    let i = 0;
    // Iterate over each invite and add its uses to the counter
    userInv.forEach((inv) => (i += inv.uses));

    // Create an embed to display the user's invite count
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("User Invite Count")
      .setDescription(`${user.tag} has **${i}** invites.`)
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Reply to the interaction with the embed
    await interaction.reply({ embeds: [embed] });
 },
};
