const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
  SlashCommandBuilder,
 } = require("discord.js");
 
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("ban")
     .setDescription("This command bans members from the server")
     .addUserOption((option) =>
       option
         .setName("target")
         .setDescription("The user you would like to ban")
         .setRequired(true)
     )
     .addStringOption((option) =>
       option
         .setName("reason")
         .setDescription("The reason for banning the user")
         .setRequired(true)
     ),
  async execute(interaction, client) {
     const banUser = interaction.options.getUser("target");
     const banMember = await interaction.guild.members.fetch(banUser.id);
     const channel = interaction.channel;
     const user = interaction.options.getUser("user") || interaction.user;
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(`You don't have permission to ban members in this server`)
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Check if the user has administrator permissions
     if (
       !interaction.member.permissions.has(
         PermissionsBitField.Flags.Administrator
       )
     )
       return await interaction.reply({ embeds: [perm], ephemeral: true });
 
     // Check if the target user is in the server
     if (!banMember)
       return await interaction.reply({
         content: "The user mentioned is no longer in the server!",
         ephemeral: true,
       });
     // Check if the bot can ban the user
     if (!banMember.bannable)
       return await interaction.reply({
         content:
           "I cannot ban this user as they have roles higher than me or you!",
         ephemeral: true,
       });
 
     // Get the reason for banning the user
     let reason = interaction.options.getString("reason");
     if (!reason) reason = "No reason given.";
 
     // Create an embed to notify the user they have been banned
     const dmEmbed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("You have been banned")
       .setDescription(
         `**${banUser.tag}** has been **banned** from ${interaction.guild.name} \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Create an embed to confirm the ban
     const embed = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("User Banned")
       .setDescription(
         `**${banUser.tag}** has been **banned** from ${interaction.guild.name} \n **Reason:** ${reason}`
       )
       .setTimestamp()
       .setFooter({ text: `${process.env.serverName}` });
 
     // Send the notification to the user
     await banMember.send({ embeds: [dmEmbed] }).catch((err) => {
       return;
     });
 
     // Ban the user
     await banMember.ban({ reason: reason }).catch((err) => {
       interaction.reply({ content: "There was an error!", ephemeral: true });
     });
 
     // Reply to the interaction with the confirmation embed
     await interaction.reply({ embeds: [embed] });
  },
 };
 