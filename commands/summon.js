const config = require('../config.json');

const connections = new Map();

// Set preferred audio files here.
const audioFiles = [
  'https://boboben.s-ul.eu/water-bot/M8gkhhlf',
  'https://boboben.s-ul.eu/water-bot/fAIUJOrL',
  'https://boboben.s-ul.eu/water-bot/wgdMQnmz',
  'https://boboben.s-ul.eu/water-bot/sAEWaK7X',
  'https://boboben.s-ul.eu/water-bot/F5EeJjBo',
];
// stetch, posture, drink-water-long, engage, please_stop

const weightedRandom = (prob) => {
  let i,
    sum = 0;
  const r = Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
};

module.exports = {
  name: 'summon',
  aliases: ['s'],
  description: 'Summons me to your current voice channel.',
  guildOnly: true,
  execute(message, args) {
    if (message.member.voice.channel) {
      message.member.voice.channel
        .join()
        .then((connection) => {
          if (!connections.has(connection)) {
            console.log(`Connected to: ${connection.channel}`);
            message.channel
              .send('Ready for action!')
              .then(() => {
                console.log(`Connection message sent to: ${message.channel}`);
              })
              .catch(console.error);
            const interval = setInterval(() => {
              const fileIndex = weightedRandom({
                0: 0.25,
                1: 0.25,
                2: 0.25,
                3: 0.125,
                4: 0.125,
              });
              const dispatcher = connection.play(audioFiles[fileIndex], {
                volume: 1.75,
              });
              dispatcher.on('start', () => {
                console.log(
                  `Started on: ${connection.channel}. Played ${audioFiles[fileIndex]}`,
                );
              });
              dispatcher.on('finish', () => {
                console.log(`Finished on: ${connection.channel}`);
              });
              dispatcher.on('error', console.error);
              if (connection.channel.members.size === 1) {
                clearInterval(connections.get(connection));
                console.log(`Disconnected from: ${connection.channel}`);
                message.channel
                  .send('No one is with me - disconnecting...')
                  .then(() => {
                    console.log(
                      `Disconnection message sent to: ${connection.channel}`,
                    );
                  })
                  .catch(console.error);
                connection.disconnect();
                return connections.delete(connection);
              }
            }, config.defaultTimer * 60000);
            connections.set(connection, interval);
          }
        })
        .catch(console.error);
    } else {
      console.log(`Attempted to send a reply to ${message.author.username}`);
      return message
        .reply('you are not in a voice channel!')
        .then(() => {
          console.log(`Reply sent`);
        })
        .catch(console.error);
    }
  },
};
