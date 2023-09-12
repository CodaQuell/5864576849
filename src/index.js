const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  ActivityType,
  PermissionFlagsBits,
  MessageManager,
  Embed,
  Collection,
  Events,
  AuditLogEvent,
  ThreadChannel,
} = require(`discord.js`);
const fs = require("fs");
const client = new Client({ intents: [Object.keys(GatewayIntentBits)] });
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.commands = new Collection();

require("dotenv").config();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.token);
})();

const levelSchema = require("./schemas/level");
client.on(Events.MessageCreate, async (message, client) => {
  const { guild, author } = message;

  if (!guild || author.bot) return;

  levelSchema.findOne(
    { Guild: guild.id, User: author.id },
    async (err, data) => {
      if (err) throw err;

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

  const channel = message.channel;

  const give = 1;

  const data = await levelSchema
    .findOne({ Guild: guild.id, User: author.id })
    .catch((err) => {
      return;
    });
  if (!data) return;

  const requiredXP = data.Level * data.Level * 20 + 20;

  if (data.XP + give >= requiredXP) {
    data.XP += give;
    data.Level += 1;
    await data.save();

    if (!channel) return;

    const levelembed = new EmbedBuilder()
      .setTitle("You Leveled Up!")
      .setColor("DarkButNotBlack")
      .setDescription(
        `Congrats ${author}! you have reached level ${data.Level}`
      )
      .setTimestamp()
      .setFooter({ text: `Alto Leveling System` });

    channel.send({ embeds: [levelembed] });
  } else {
    data.XP += give;
    data.save();
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const role = await db.get(`autorole_${member.guild.id}`);
  const giveRole = member.guild.roles.cache.get(role);

  member.roles.add(giveRole).catch((err) => {
    return;
  });
});

client.on(Events.GuildMemberAdd, async (member) => {
  const channelID = await db.get(`welchannel_${member.guild.id}`);
  const channel = member.guild.channels.cache.get(channelID);
  if (channelID == null) return;

  channel.send(`**Welcome to ${member.guild.name}, ${member}**`);
});

client.on(Events.GuildMemberRemove, async (member) => {
  const channelID = await db.get(`welchannel_${member.guild.id}`);
  const channel = member.guild.channels.cache.get(channelID);
  if (channelID == null) return;

  channel.send(`**${member} left ${member.guild.name}**`);
});

// Mod logs //
const Modlog = require("./schemas/mog");

client.on(Events.ChannelCreate, async (channel) => {
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

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 4) type = "Announcement";
      if (type == 5) type = "Category";

      const mChannel = await channel.guild.channels.cache.get(
        modlog.logChannelId
      );

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.ChannelDelete, async (channel) => {
  const Modlog = require("./schemas/mog");

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

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 4) type = "Announcement";
      if (type == 5) type = "Category";

      const mChannel = await channel.guild.channels.cache.get(
        modlog.logChannelId
      );

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanAdd, async (member) => {
  const Modlog = require("./schemas/mog");

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

      const name = member.user.username;
      const id = member.user.id;

      const mChannel = await member.guild.channels.cache.get(
        modlog.logChannelId
      );

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanRemove, async (member) => {
  const Modlog = require("./schemas/mog");

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

      const name = member.user.username;
      const id = member.user.id;

      const mChannel = await member.guild.channels.cache.get(
        modlog.logChannelId
      );

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
        .setFooter({ text: "Mod Logging by Maru v2" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageDelete, async (message) => {
  const Modlog = require("./schemas/mog");

  const guildId = message.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mes = message.content;

      if (!mes) return;

      const mChannel = await message.guild.channels.cache.get(
        modlog.logChannelId
      );

      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Message Delete")
        .addFields({ name: "Message Content", value: `${mes}`, inline: false })
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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageUpdate, async (message, newMessage) => {
  const Modlog = require("./schemas/mog");

  const guildId = message.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageUpdate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mes = message.content;

      if (!mes) return;

      const mChannel = await message.guild.channels.cache.get(
        modlog.logChannelId
      );

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageBulkDelete, async (messages) => {
  const Modlog = require("./schemas/mog");

  const guildId = messages.first().guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  messages
    .first()
    .guild.fetchAuditLogs({
      type: AuditLogEvent.MessageBulkDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mChannel = await messages
        .first()
        .guild.channels.cache.get(modlog.logChannelId);

      const embed = new EmbedBuilder()
        .setColor("DarkButNotBlack")
        .setTitle("Message Bulk Delete")
        .addFields({
          name: "Message Channel",
          value: `${messages.first().channel} `,
          inline: true,
        })
        .addFields({
          name: "Bulk Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildRoleCreate, async (role) => {
  const Modlog = require("./schemas/mog");

  const guildId = role.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  role.guild
    .fetchAuditLogs({
      type: AuditLogEvent.RoleCreate,
    })
    .then(async (audit) => {
      const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildRoleDelete, async (role) => {
  const Modlog = require("./schemas/mog");

  const guildId = role.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  role.guild
    .fetchAuditLogs({
      type: AuditLogEvent.RoleDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mChannel = await role.guild.channels.cache.get(modlog.logChannelId);

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildMemberAdd, async (member) => {
  const Modlog = require("./schemas/mog");

  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);

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
    .setFooter({ text: `Alto Moderation Logging System` });

  mChannel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberRemove, async (member) => {
  const Modlog = require("./schemas/mog");

  const guildId = member.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  const mChannel = await member.guild.channels.cache.get(modlog.logChannelId);

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
    .setFooter({ text: `Alto Moderation Logging System` });

  mChannel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberRemove, async (member) => {
  const Modlog = require("./schemas/mog");

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
        .setFooter({ text: `Alto Moderation Logging System` });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.InviteCreate, async (invite) => {
  const Modlog = require("./schemas/mog");

  const guildId = invite.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }

  const mChannel = await invite.guild.channels.cache.get(modlog.logChannelId);

  const embed = new EmbedBuilder()
    .setColor("DarkButNotBlack")
    .setTitle("Invite Created")
    .addFields({ name: "Code", value: `${invite.code}`, inline: true })
    .addFields({ name: "Channel", value: `${invite.channel}`, inline: true })
    .addFields({ name: "Inviter", value: `${invite.inviter}`, inline: true })
    .setTimestamp()
    .setFooter({ text: `Alto Moderation Logging System` });

  mChannel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const Modlog = require("./schemas/mog");

  const guildId = newMember.guild.id;
  const modlog = await Modlog.findOne({ guildId });

  if (!modlog || !modlog.logChannelId) {
    return; // if there's no log channel set up, return without sending any log message
  }
  newMember.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MemberUpdate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mChannel = await newMember.guild.channels.cache.get(
        modlog.logChannelId
      );

      if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const addedRoles = newMember.roles.cache.filter(
          (role) => !oldMember.roles.cache.has(role.id)
        );
        const roleNameArray = addedRoles.map((role) => `<@&${role.id}>`);
        const rolesAddedString = roleNameArray.join(", ");

        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Roles Added")
          .addFields(
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Roles Added", value: rolesAddedString, inline: true },
            { name: "Role Added By", value: `${executor.tag}`, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: `Alto Moderation Logging System` });

        mChannel.send({ embeds: [embed] });
      }
    });
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const Modlog = require("./schemas/mog");

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
      const { executor } = audit.entries.first();
      const mChannel = await newMember.guild.channels.cache.get(
        modlog.logChannelId
      );

      if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const removedRoles = oldMember.roles.cache.filter(
          (role) => !newMember.roles.cache.has(role.id)
        );
        const roleNameArray = removedRoles.map((role) => `<@&${role.id}>`);
        const rolesRemovedString = roleNameArray.join(", ");

        const embed = new EmbedBuilder()
          .setColor("DarkButNotBlack")
          .setTitle("Roles Removed")
          .addFields(
            { name: "User", value: `<@${newMember.id}>`, inline: true },
            { name: "Roles Removed", value: rolesRemovedString, inline: true },
            { name: "Role Removed By", value: `${executor.tag}`, inline: false }
          )
          .setTimestamp()
          .setFooter({ text: `Alto Moderation Logging System` });

        mChannel.send({ embeds: [embed] });
      }
    });
});

const reportSchema = require("./schemas/report");
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "modal") {
    const contact = interaction.fields.getTextInputValue("contact");
    const issue = interaction.fields.getTextInputValue("issue");
    const description = interaction.fields.getTextInputValue("description");

    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

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
      .setFooter({ text: `Alto Moderation System` });

    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) return;

      if (data) {
        const channelID = data.Channel;

        const channel = interaction.guild.channels.cache.get(channelID);

        channel.send({ embeds: [embed] });

        await interaction.reply({
          content: `Your report has been submitted to ${channel}`,
          ephemeral: true,
        });
      }
    });
  }
});
