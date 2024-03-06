// Importing necessary modules and classes from discord.js and fs
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  Collection,
  Events,
  AuditLogEvent,
} = require(`discord.js`);
const fs = require("fs");

// Creating a new Discord client instance with specific intents
const client = new Client({ intents: [Object.keys(GatewayIntentBits)] });

// Importing QuickDB for simple local database functionalities
const { QuickDB } = require("quick.db");
const db = new QuickDB();

// Storing bot commands in a Collection
client.commands = new Collection();

// Loading environment variables from a .env file
require("dotenv").config();

// Getting all function files from the "functions" directory
const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));

// Getting all event files from the "events" directory
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));

// Getting all command folders from the "commands" directory
const commandFolders = fs.readdirSync("./src/commands");

// Immediately invoked function to handle setup asynchronously
(async () => {
  // Loading all functions and passing the Discord client instance
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }

  // Handling events by passing the event files and the events directory
  client.handleEvents(eventFiles, "./src/events");

  // Handling commands by passing the command folders and the commands directory
  client.handleCommands(commandFolders, "./src/commands");

  // Logging in the Discord bot using the token from the .env file
  client.login(process.env.token);
})();

// Importing the levelSchema from the 'level_schema' file
const levelSchema = require("./Schemas/level_schema");

// Event listener for when a message is created
client.on(Events.MessageCreate, async (message, client) => {
  // Destructuring necessary properties from the message object
  const { guild, author } = message;

  // Checking if the message is not in a guild or if the author is a bot
  if (!guild || author.bot) return;

  // Finding data in the level schema based on guild and author IDs
  levelSchema.findOne(
    { Guild: guild.id, User: author.id },
    async (err, data) => {
      if (err) throw err;

      // If no data exists, create new data for the author in the level schema
      if (!data) {
        levelSchema.create({
          Guild: guild.id,
          User: author.id,
          XP: 0,
          Level: 0,
        });
      }
    }
  );

  // Getting the channel where the message was sent
  const channel = message.channel;

  // Generating a random amount of XP to give to the user
  const give = Math.floor(Math.random() * 3);

  // Retrieving data for the author from the level schema
  const data = await levelSchema
    .findOne({ Guild: guild.id, User: author.id })
    .catch((err) => {
      return;
    });

  // If no data exists, return from the function
  if (!data) return;

  // Calculating required XP for the next level based on current level
  const requiredXP = data.Level * data.Level * 20 + 20;

  // Checking if the accumulated XP meets the required XP for the next level
  if (data.XP + give >= requiredXP) {
    // If XP meets the requirement, increase XP and level, and save the changes
    data.XP += give;
    data.Level += 1;
    await data.save();

    // If there's no channel to send the message, return from the function
    if (!channel) return;

    // Creating an embed to notify the user about leveling up
    const levelembed = new EmbedBuilder()
      .setTitle("You Leveled Up!")
      .setColor("DarkButNotBlack")
      .setDescription(
        `Congrats ${author}! you have reached level ${data.Level}`
      )
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Sending the embed to the channel
    channel.send({ embeds: [levelembed] });
  } else {
    // If XP doesn't meet the requirement, only increase XP and save the changes
    data.XP += give;
    data.save();
  }
});

//reporting system
// Importing the reportSchema from the 'report_schema' file
const reportSchema = require("./Schemas/report_schema");

// Event listener for when an interaction is created
client.on(Events.InteractionCreate, async (interaction) => {
  // Checking if the interaction is not a modal submit
  if (!interaction.isModalSubmit()) return;

  // Checking if the custom ID of the interaction is 'modal'
  if (interaction.customId === "modal") {
    // Getting values from the submitted form
    const contact = interaction.fields.getTextInputValue("contact");
    const issue = interaction.fields.getTextInputValue("issue");
    const description = interaction.fields.getTextInputValue("description");

    // Retrieving information about the member, tag, and server
    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

    // Creating an embed to represent the report
    const embed = new EmbedBuilder()
      .setColor("DarkButNotBlack")
      .setTitle("New Report")
      .setDescription(`Reporting Member: ${tag} (${member})`)
      .addFields({
        name: "Form of Contact",
        value: `${contact}`,
        inline: false,
      })
      .addFields({ name: "Issue Reported", value: `${issue}`, inline: false })
      .addFields({
        name: "Description of the issue",
        value: `${description}`,
        inline: false,
      })
      .setTimestamp()
      .setFooter({ text: `${process.env.serverName}` });

    // Finding data in the report schema based on the guild ID
    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) return;

      // If data exists in the schema
      if (data) {
        const channelID = data.Channel;

        // Getting the channel using its ID
        const channel = interaction.guild.channels.cache.get(channelID);

        // Sending the report embed to the designated channel
        channel.send({ embeds: [embed] });

        // Sending an ephemeral reply to the user who submitted the report
        await interaction.reply({
          content: `Your report has been submitted to ${channel}`,
          ephemeral: true,
        });
      }
    });
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  // Retrieve the autorole ID from the database for the guild
  const role = await db.get(`autorole_${member.guild.id}`);

  // Get the role object using the role ID
  const giveRole = member.guild.roles.cache.get(role);

  // Check if the role is valid and exists in the guild
  if (giveRole == null) return;

  // Add the retrieved role to the member who just joined
  member.roles.add(giveRole).catch((err) => {
    return; // Handling errors if unable to assign the role
  });
});

// Event listener for when a new member joins a guild
client.on(Events.GuildMemberAdd, async (member) => {
  // Retrieving the welcome channel ID from the database
  const channelID = await db.get(`welchannel_${member.guild.id}`);
  // Getting the channel using the channel ID from the cache
  const channel = member.guild.channels.cache.get(channelID);

  // Checking if the welcome channel ID is not set or invalid
  if (channelID == null) return;

  // Sending a welcome message to the designated welcome channel
  channel.send(`**Welcome to ${member.guild.name}, ${member}**`);
});

// Event listener for when a member leaves a guild
client.on(Events.GuildMemberRemove, async (member) => {
  // Retrieving the welcome channel ID from the database
  const channelID = await db.get(`welchannel_${member.guild.id}`);
  // Getting the channel using the channel ID from the cache
  const channel = member.guild.channels.cache.get(channelID);

  // Checking if the welcome channel ID is not set or invalid
  if (channelID == null) return;

  // Sending a message notifying the departure of a member to the designated channel
  channel.send(`**${member} left ${member.guild.name}**`);
});

//Mod Logs

client.on(Events.GuildMemberAdd, async (member) => {
  const Modlog = require("./Schemas/mod_log_schema");

  // Retrieving the modlog settings for the guild
  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  // Checking if modlog or log channel is not set up
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Getting the log channel from the cache
  const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);

  // Creating an embed for the member join event
  const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Member Joined")
    .addFields({
      name: "Username",
      value: `${member.user.username}#${member.user.discriminator} (${member.user.id})`,
      inline: false,
    })
    .addFields({
      name: "Joined At",
      value: `${member.joinedAt.toUTCString()}`,
      inline: false,
    })
    .setTimestamp()
    .setFooter({ text: `${process.env.serverName}` });

  // Sending the log message to the log channel
  mChannel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberRemove, async (member) => {
  const Modlog = require("./Schemas/mod_log_schema");

  // Retrieving the modlog settings for the guild
  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  // Checking if modlog or log channel is not set up
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Getting the log channel from the cache
  const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);

  // Creating an embed for the member leave event
  const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Member Left")
    .addFields({
      name: "Username",
      value: `${member.user.username}#${member.user.discriminator} (${member.user.id})`,
      inline: false,
    })
    .addFields({
      name: "Left At",
      value: `${new Date().toUTCString()}`,
      inline: false,
    })
    .setTimestamp()
    .setFooter({ text: `${process.env.serverName}` });

  // Sending the log message to the log channel
  mChannel.send({ embeds: [embed] });
});

client.on(Events.InviteCreate, async (invite) => {
  const Modlog = require("./Schemas/mod_log_schema");

  // Retrieving the modlog settings for the guild where the invite was created
  const guildId = invite.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  // Checking if modlog or log channel is not set up
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Getting the log channel from the cache
  const mChannel = await invite.guild.channels.cache.get(modlog.logChannelId);

  // Creating an embed for the invite creation event
  const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Invite Created")
    .addFields({ name: "Code", value: `${invite.code}`, inline: true })
    .addFields({ name: "Channel", value: `${invite.channel}`, inline: true })
    .addFields({ name: "Inviter", value: `${invite.inviter}`, inline: true })
    .setTimestamp()
    .setFooter({ text: `${process.env.serverName}` });

  // Sending the log message to the log channel
  mChannel.send({ embeds: [embed] });
});

client.on(Events.ChannelCreate, async (channel) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = channel.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      // Extracting channel information
      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      // Mapping channel types to human-readable format
      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 4) type = "Announcement";
      if (type == 5) type = "Category";

      const mChannel = await channel.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Creating an embed for the channel creation event
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Channel Created")
        .addFields({
          name: "Channel Name",
          value: `${name} (<#${id}>)`,
          inline: false,
        })
        .addFields({ name: "Channel Type", value: `${type} `, inline: true })
        .addFields({ name: "Channel ID", value: `${id} `, inline: true })
        .addFields({
          name: "Created By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Sending the log message to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.ChannelDelete, async (channel) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = channel.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      // Extracting channel information
      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      // Mapping channel types to human-readable format
      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 4) type = "Announcement";
      if (type == 5) type = "Category";

      const mChannel = await channel.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Creating an embed for the channel deletion event
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Channel Deleted")
        .addFields({ name: "Channel Name", value: `${name}`, inline: false })
        .addFields({ name: "Channel Type", value: `${type} `, inline: true })
        .addFields({ name: "Channel ID", value: `${id} `, inline: true })
        .addFields({
          name: "Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Sending the log message to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildMemberRemove, async (member) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MemberKick,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mChannel = await member.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Creating an embed for the member kick event
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Member Kicked")
        .addFields({
          name: "User",
          value: `${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        })
        .addFields({
          name: "Kicked By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Sending the log message to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanAdd, async (member) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanAdd,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      // Extracting member information
      const name = member.user.username;
      const id = member.user.id;

      const mChannel = await member.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Creating an embed for the member banned event
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Member Banned")
        .addFields({
          name: "Member Name",
          value: `${name} (<@${id}>)`,
          inline: false,
        })
        .addFields({ name: "Member ID", value: `${id} `, inline: true })
        .addFields({
          name: "Banned By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Sending the log message to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanRemove, async (member) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanRemove,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      // Extracting member information
      const name = member.user.username;
      const id = member.user.id;

      const mChannel = await member.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Creating an embed for the member unbanned event
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Member Unbanned")
        .addFields({
          name: "Member Name",
          value: `${name} (<@${id}>)`,
          inline: false,
        })
        .addFields({ name: "Member ID", value: `${id} `, inline: true })
        .addFields({
          name: "Unbanned By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Sending the log message to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageBulkDelete, async (messages) => {
  // Import the mod_log_schema
  const Modlog = require("./Schemas/mod_log_schema");

  // Get the guild ID of the first message in the bulk delete
  const guildId = messages.first().guild.id;
  // Find the mod log for the guild
  const modlog = await Modlog.findOne({ guildId });

  // If there's no mod log or no log channel set up, return without sending any log message
  if (!modlog || !modlog.logChannelId) {
    return;
  }

  // Fetch the audit logs for the message bulk delete
  messages
    .first()
    .guild.fetchAuditLogs({
      type: AuditLogEvent.MessageBulkDelete,
    })
    .then(async (audit) => {
      // Get the executor of the message bulk delete
      const executor = audit.entries.first().executor;

      // Get the log channel
      const mChannel = await messages
        .first()
        .guild.channels.cache.get(modlog.logChannelId);

      // Create an embed with the relevant information
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Message Bulk Delete")
        .addFields({
          name: "Message Channel",
          value: `${messages.first().channel} `,
          inline: true,
        })
        .addFields({
          name: "Amount of messages",
          value: `${messages.size}`,
        })
        .addFields({
          name: "Bulk Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Send the embed to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const Modlog = require("./Schemas/mod_log_schema");

  const guildId = newMember.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  newMember.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MemberRoleUpdate,
    })
    .then(async (audit) => {
      if (!audit.entries.size) {
        return; // If there are no audit log entries, return without sending any log message
      }
      const firstEntry = audit.entries.first();
      const executor = firstEntry.executor;
      const mChannel = await newMember.guild.channels.cache.get(
        modlog.logChannelId
      );

      if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        // Determine the roles that were removed
        const removedRoles = oldMember.roles.cache.filter(
          (role) => !newMember.roles.cache.has(role.id)
        );
        const roleNameArray = removedRoles.map((role) => `<@&${role.id}>`);
        const rolesRemovedString = roleNameArray.join(", ");

        // Create an embed for the roles removed event
        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Roles Removed")
          .addFields(
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Roles Removed", value: rolesRemovedString, inline: true },
            { name: "Role Removed By", value: `${executor.tag}`, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: `${process.env.serverName}` });

        // Send the log message to the log channel
        mChannel.send({ embeds: [embed] });
      }

      if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        // Determine the roles that were added
        const addedRoles = newMember.roles.cache.filter(
          (role) => !oldMember.roles.cache.has(role.id)
        );
        const roleNameArray = addedRoles.map((role) => `<@&${role.id}>`);
        const rolesAddedString = roleNameArray.join(", ");

        // Create an embed for the roles added event
        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Roles Added")
          .addFields(
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Roles Added", value: rolesAddedString, inline: true },
            { name: "Role Added By", value: `${executor.tag}`, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: `${process.env.serverName}` });

        mChannel.send({ embeds: [embed] });
        // Send the log message to the log channel
      }
    });
});

// Event listener for when a message is deleted
client.on(Events.MessageDelete, async (message) => {
  // Require the Modlog schema
  const Modlog = require("./Schemas/mod_log_schema");

  // Get the ID of the guild where the message was deleted
  const guildId = message.guild.id;

  // Find the corresponding modlog for the guild
  const modlog = await Modlog.findOne({ guildId });

  // If there's no modlog or log channel defined, exit the function
  if (!modlog || !modlog.logChannelId) {
    return;
  }

  // Fetch audit logs related to message deletion
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
    })
    .then(async (audit) => {
      // Get the first entry in the audit log
      const firstEntry = audit.entries.first();

      // Check if the first entry exists and has the 'executor' property
      if (firstEntry && firstEntry.executor) {
        // Get the executor (user who deleted the message) from the audit log
        const { executor } = firstEntry;

        // Get the content of the deleted message
        const mes = message.content;

        // If there's no message content, exit the function
        if (!mes) return;

        // Get the log channel where the message deletion will be logged
        const mChannel = await message.guild.channels.cache.get(
          modlog.logChannelId
        );

        // Create an embed to log the message deletion details
        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Message Delete")
          .addFields({
            name: "Message Content",
            value: `${mes}`,
            inline: false,
          })
          .addFields({
            name: "Message Channel",
            value: `${message.channel} `,
            inline: true,
          })
          .addFields({
            name: "Deleted By",
            value: `${executor.tag}`,
            inline: false,
          })
          .setTimestamp()
          .setFooter({ text: `${process.env.serverName}` });

        // Send the embed to the log channel
        mChannel.send({ embeds: [embed] });
      }
    });
});

// Event listener for when a message is updated
client.on(Events.MessageUpdate, async (message, newMessage) => {
  // Require the Modlog schema
  const Modlog = require("./Schemas/mod_log_schema");

  // Get the ID of the guild where the message was updated
  const guildId = message.guild.id;

  // Find the corresponding modlog for the guild
  const modlog = await Modlog.findOne({ guildId });

  // If there's no modlog or log channel defined, exit the function
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Fetch audit logs related to message updates
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageUpdate,
    })
    .then(async (audit) => {
      // Get the executor (user who updated the message) from the audit log
      const { executor } = audit.entries.first();

      // Get the content of the original message
      const mes = message.content;

      // If there's no original message content, exit the function
      if (!mes) return;

      // Get the log channel where the message update will be logged
      const mChannel = await message.guild.channels.cache.get(
        modlog.logChannelId
      );

      // Create an embed to log the message update details
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Message Edited")
        .addFields({ name: "Old Message", value: `${mes}`, inline: false })
        .addFields({
          name: "New Message",
          value: `${newMessage} `,
          inline: true,
        })
        .addFields({
          name: "Edited By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Send the embed to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

// Event listener for when a new role is created in the guild
client.on(Events.GuildRoleCreate, async (role) => {
  // Require the Modlog schema
  const Modlog = require("./Schemas/mod_log_schema");

  // Get the ID of the guild where the role was created
  const guildId = role.guild.id;

  // Find the corresponding modlog for the guild
  const modlog = await Modlog.findOne({ guildId });

  // If there's no modlog or log channel defined, exit the function
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Fetch audit logs related to role creation
  role.guild
    .fetchAuditLogs({
      type: AuditLogEvent.RoleCreate,
    })
    .then(async (audit) => {
      // Get the log channel where the role creation will be logged
      const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);

      // Get the executor (user who created the role) from the audit log
      const { executor } = audit.entries.first();

      // Create an embed to log the role creation details
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Role Created")
        .addFields({
          name: "Role Name",
          value: `<@&${role.id}> `,
          inline: true,
        })
        .addFields({
          name: "Role Created By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Send the embed to the log channel
      mChannel.send({ embeds: [embed] });
    });
});

// Event listener for when a role is deleted in the guild
client.on(Events.GuildRoleDelete, async (role) => {
  // Require the Modlog schema
  const Modlog = require("./Schemas/mod_log_schema");

  // Get the ID of the guild where the role was deleted
  const guildId = role.guild.id;

  // Find the corresponding modlog for the guild
  const modlog = await Modlog.findOne({ guildId });

  // If there's no modlog or log channel defined, exit the function
  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  // Fetch audit logs related to role deletion
  role.guild
    .fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
    })
    .then(async (audit) => {
      // Get the executor (user who deleted the role) from the audit log
      const { executor } = audit.entries.first();

      // Get the log channel where the role deletion will be logged
      const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);

      // Create an embed to log the role deletion details
      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Role Deleted")
        .addFields({
          name: "Role Name",
          value: `${role.name} (${role.id})`,
          inline: true,
        })
        .addFields({
          name: "Role Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `${process.env.serverName}` });

      // Send the embed to the log channel
      mChannel.send({ embeds: [embed] });
    });
});
