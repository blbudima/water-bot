const connections = new Map();

// Set preferred audio files here
const audioFiles = [
  'https://boboben.s-ul.eu/water-bot/M8gkhhlf',
  'https://boboben.s-ul.eu/water-bot/fAIUJOrL',
  'https://boboben.s-ul.eu/water-bot/wgdMQnmz',
  'https://boboben.s-ul.eu/water-bot/sAEWaK7X',
  'https://boboben.s-ul.eu/water-bot/F5EeJjBo',
];
// current order: stetch, posture, drink-water-long, engage, please_stop

/**
 * weightedRandom takes in a list of probablities per index
 * and returns the index of the array to use.
 *
 * @param {Object} prob a mapping of key-value pairs such that the index
 * is the key and its probablity is the value.
 */
const weightedRandom = (prob) => {
  let i,
    sum = 0;
  const r = Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
};

// main module for summon
module.exports = {
  name: 'summon',
  aliases: ['s'],
  description: 'Summons me to your current voice channel.',
  guildOnly: true,
  execute(message, args) {
    // only join if the member is in a voice channel
    if (message.member.voice.channel) {
      message.member.voice.channel
        .join()
        .then((connection) => {
          // only record the connection if it doesn't already exist
          if (!connections.has(connection)) {
            console.log(`Connected to: ${connection.channel}`);
            message.channel
              .send('Ready for action!')
              .then(() => {
                console.log(
                  `Connection message sent to: ${connection.channel}`,
                );
              })
              .catch(console.error);
            // create interval for repeating message
            const interval = setInterval(() => {
              // set weighted probablities here
              const fileIndex = weightedRandom({
                0: 0.3,
                1: 0.3,
                2: 0.3,
                3: 0.075,
                4: 0.025,
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
            }, process.env.defaultTimer * 60000);
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
