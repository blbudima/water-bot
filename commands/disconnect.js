module.exports = {
  name: 'disconnect',
  aliases: ['d'],
  description: 'Disconnects me from your current voice channel.',
  guildOnly: true,
  execute(message, args) {
    if (message.member.voice.channel) {
      message.member.voice.channel.leave();
    } else {
      return message.reply('you are not in a voice channel!');
    }
  },
};
