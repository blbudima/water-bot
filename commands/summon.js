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
            message.channel.send('Ready for action!');
            const interval = setInterval(() => {
              // set your preferred audio message here.
              const audioMessage = 'https://boboben.s-ul.eu/wgdMQnmz';
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
                message.channel.send('No one is with me - disconnecting...');
                connection.disconnect();
                return connections.delete(connection);
              }
            }, process.env.defaultTimer * 60000);
            connections.set(connection, interval);
          }
        })
        .catch(console.error);
    } else {
      return message.reply('you are not in a voice channel!');
    }
  },
};

// if (interval) {
//   clearInterval(interval);
//   console.log('Cleared interval!');
// } else {
//   message.channel.send('Ready for action!');
// }
// interval = setInterval(() => {
//   // set your preferred audio message here.
//   const audioMessage = audio.drinkwater;
//   const dispatcher = connection.play(audioMessage, {
//     volume: 2,
//   });
//   dispatcher.on('finish', () => {
//     /* nothing for now */
//   });
//   dispatcher.on('error', console.error);
//   if (connection.channel.members.size === 1) {
//     connection.disconnect();
//     return clearInterval(interval);
//   }
// }, config.defaultTimer * 60000);
// // 60000 ms = 1 min
