// Import necessary classes from discord.js and a schema for leveling
const {
  EmbedBuilder,
  DiscordAPIError,
  SlashCommandBuilder,
 } = require("discord.js");
 const levelSchema = require(`../../Schemas/level_schema`);
 
 // Export an object with command data and an execute function
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("xp-leaderboard") // Set the command name
     .setDescription("This gets a servers xp leaderboard") // Set the command description
     .addStringOption((option) => // Add a string option for the reason
       option
         .setName("reason") // Set the option name
         .setDescription(`The reason for reseting this user's XP`) // Set the option description
         .setRequired(true) // Make the option required
     ),
  async execute(interaction) {
     const { guild, client, user } = interaction;
 
     let text = "";
 
     // Create an embed for error messages if the leaderboard is empty
     const embed1 = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(`No one is on the leaderboard yet`)
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Fetch the top 10 users by XP and level from the database
     const Data = await levelSchema
       .find({ Guild: guild.id })
       .sort({
         XP: -1,
         Level: -1,
       })
       .limit(10);
 
     // If no data is found, reply with the error embed and return
     if (!Data) return await interaction.reply({ embeds: [embed1] });
 
     // Defer the reply to the interaction
     await interaction.deferReply();
 
     // Loop through the fetched data to build the leaderboard text
     for (let counter = 0; counter < Data.length; ++counter) {
       let { User, XP, Level } = Data[counter];
 
       // Fetch the user object from Discord
       const value = (await client.users.fetch(User)) || "Unknown Member";
 
       // Get the display name of the user
       const member = value.displayName;
 
       // Append the user's rank, name, XP, and level to the leaderboard text
       text += `${counter + 1}. ${member} | XP: ${XP} | Level: ${Level} \n`;
 
       // Create an embed to display the leaderboard
       const embed = new EmbedBuilder()
         .setColor("DarkButNotBlack")
         .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
         .setDescription(`\`\`\`${text}\`\`\``)
         .setTimestamp()
         .setFooter({ text: `${process.env.serverName}` });
 
       // Edit the deferred reply with the leaderboard embed
       interaction.editReply({ embeds: [embed] });
     }
  },
 };
 