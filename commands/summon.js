// set your configuration variables in config.json
const config = require('../config.json');

// set your audio files in audio-files.json
// YOUR BOT WILL PLAY THE FIRST FILE IN YOUR LIST UPON SUMMON
const audioFiles = require('../audio-files.json');

// set your probabilities per audio files here
const simpleProb = {
  0: 0.4,
  1: 0.3,
  2: 0.3,
};

const maleProb = {
  0: 0.38,
  1: 0.3,
  2: 0.3,
  3: 0.015,
  4: 0.005,
};

const femaleProb = {
  0: 0.4,
  1: 0.3,
  2: 0.3,
};

// set your valid arguments here
const validArgs = ['simple', 'male', 'female'];

// set your timer here
// const timer = 5000;
const timer = config.defaultTimer * 60000;

// --------------------------------------------------------------------------
// ENSURE THAT YOU SET YOUR VARIABLES, AUDIO, PROBABILITIES, AND TIMER ABOVE.
// --------------------------------------------------------------------------

// map of connections
const connections = new Map();

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
  // picks a random number between 0 (inclusive) and 1 (exclusive)
  const r = Math.random();
  for (i in prob) {
    sum += prob[i];
    // if the total sum is greater than the random number selected, return i
    if (r <= sum) return i;
  }
};

module.exports = {
  name: 'summon',
  aliases: ['s'],
  description: 'Summons me to your current voice channel.',
  // you should also change the usage here if you have other voices
  usage: '<simple/male/female>',
  guildOnly: true,
  args: true,
  execute(message, args) {
    // check if user argument is valid
    if (!validArgs.includes(args[0])) {
      return message.reply('invalid argument! Please specify the type of bot.');
    }
    if (message.member.voice.channel) {
      message.member.voice.channel
        .join()
        .then((connection) => {
          // clear old connection
          if (connections.has(connection)) {
            console.log(`Clearing old connection from: ${connection.channel}`);
            clearInterval(connections.get(connection));
            connections.delete(connection);
          }
          console.log(`Connected to: ${connection.channel}`);
          message.channel
            .send('Ready for action!')
            .then(() => {
              console.log(`Connection message sent to: ${message.channel}`);
            })
            .catch(console.error);
          // extract probability rate
          let probs = undefined;
          switch (args[0]) {
            case 'simple':
              probs = simpleProb;
              break;
            case 'male':
              probs = maleProb;
              break;
            case 'female':
              probs = femaleProb;
              break;
            default:
              console.error('Something went wrong extracting probability!');
              return message.reply('something went wrong. Please try again.');
          }
          // extract audio files
          let audio = undefined;
          switch (args[0]) {
            case 'simple':
              audio = audioFiles.simple;
              break;
            case 'male':
              audio = audioFiles.male;
              break;
            case 'female':
              audio = femaleProb;
              break;
            default:
              console.error('Something went wrong extracting audio!');
              return message.reply('something went wrong. Please try again.');
          }
          // place initial water message first
          const initialDispatcher = connection.play(audio[0], {
            volume: 1.75,
          });
          initialDispatcher.on('start', () => {
            console.log(
              `Initial reminder started on: ${connection.channel}. Played ${audio[0]}`,
            );
          });
          initialDispatcher.on('finish', () => {
            console.log(`Initial reminder finished on: ${connection.channel}`);
          });
          initialDispatcher.on('error', console.error);
          // create interval
          const interval = setInterval(() => {
            const fileIndex = weightedRandom(probs);
            const dispatcher = connection.play(audio[fileIndex], {
              volume: 1.75,
            });
            dispatcher.on('start', () => {
              console.log(
                `Started on: ${connection.channel}. Played ${audio[fileIndex]}`,
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
          }, timer);
          // set connection-interval pair
          connections.set(connection, interval);
        })
        .catch(console.error);
    } else {
      // if user not in channel, send error
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
