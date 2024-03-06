const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
  ChannelType,
 } = require("discord.js");
 
 module.exports = {
  data: new SlashCommandBuilder()
     .setName("create-channel")
     .setDescription("creates a channel")
     .addStringOption((option) =>
       option.setName("name").setDescription("The channels name").setRequired(true)
     )
     .addChannelOption(
       (option) =>
         option
           .setName("category") // Corrected: Option for selecting category
           .setDescription("The parent category") // Option description
           .addChannelTypes(ChannelType.GuildCategory) // Allowing only guild categories
           .setRequired(true) // Making this option required
     ),
  /**
    *
    * @param {ChatInputCommandInteraction} interaction
    */
  async execute(interaction) {
     const { options, guild, user } = interaction;
 
     // Get the category and channel name from the command options
     const category = options.getChannel("category"); // Corrected: Option name
     const name = options.getString("name");
 
     // Create an embed for error messages if the user does not have permission
     const perm = new EmbedBuilder()
       .setColor("DarkButNotBlack")
       .setTitle("Error")
       .setDescription(
         `You don't have permission to create channels in this server`
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
 
     // Attempt to create the channel
     await guild.channels.create({
       name: name,
       type: ChannelType.GuildText,
       parent: category, // Corrected: Use the category option
     })
     .then(channel => {
       // Create an embed to confirm the channel creation
       const embed = new EmbedBuilder()
         .setColor("DarkButNotBlack")
         .setTitle("Channel Created!")
         .setDescription(`The channel ${channel.name} has been created by ${user.tag}`)
         .setTimestamp()
         .setFooter({ text: `${process.env.serverName}` });
 
       // Reply to the interaction with the confirmation embed
       interaction.reply({ embeds: [embed] });
     })
     .catch(error => {
       console.error(error); // Log any errors that occur during creation
       return interaction.reply({ content: "There was an error creating the channel!", ephemeral: true });
     });
  },
 };
 