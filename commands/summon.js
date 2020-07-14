const config = require('../config.json');

// TODO: FIX SINGULAR CONNECTIONS - ATM IT DISCONNECTS FROM ALL SERVERS :/

const connections = new Map();

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
              // set your preferred audio message here.
              const audioMessage = 'https://boboben.s-ul.eu/water-bot/6AqjhMFb';
              const dispatcher = connection.play(audioMessage, {
                volume: 1.75,
              });
              dispatcher.on('start', () => {
                console.log(`Started on: ${connection.channel}`);
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
            }, 7000);
            // config.defaultTimer * 60000
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
