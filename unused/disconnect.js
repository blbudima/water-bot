const audio = require('../audio-paths.json');
const config = require('../config.json');

module.exports = {
  name: 'disconnect',
  aliases: ['d'],
  description: 'Disconnects me from your current voice channel.',
  guildOnly: true,
  execute(message, args) {
    if (message.member.voice.channel) {
      message.member.voice.channel.leave();
      return message.reply(
        'I should have disconnected. If I have not disconnected, ' +
          'please ensure that you are in the channel that I am in!',
      );
    } else {
      return message.reply('you are not in a voice channel!');
    }
  },
};
