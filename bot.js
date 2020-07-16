// main bot javascript file

// file system
const fs = require('fs');

// discord.js Client and Collection
const { Client, Collection } = require('discord.js');

// prepare cooldowns, client, and commands
const cooldowns = new Collection();
const client = new Client();
client.commands = new Collection();

// extract commands through file-system
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

// add commands to client
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// log ready into console
client.once('ready', () => {
  console.log('Ready for action!');
});

// react on member message
client.on('message', (message) => {
  // if the message is not a designated command, then ignore
  if (!message.content.startsWith(process.env.prefix) || message.author.bot) {
    return;
  }

  // extract arguments and command name
  const args = message.content.slice(process.env.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // extract command from command name
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );

  // check if the command name is valid
  if (!command) return message.reply("that's an invalid command!");

  // check if command is only allowed in servers
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply(
      "I can't execute that command inside DMs! Please find a proper server to execute that command.",
    );
  }

  // check if command requests user arguments
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // ensure cooldown on commands
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount =
    (command.cooldown || process.env.defaultCooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1,
        )} more second(s) before reusing the \`${command.name}\` command.`,
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  // attempt to execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command.');
  }
});

// log into discord via token
client.login(process.env.token);
