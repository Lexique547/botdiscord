// Command Definition File
// Exports all custom commands to the command handler
module.exports = {
  help: require('./commands/help.js'),
  invite: require('./commands/invite.js'),
  nick: require('./commands/nick.js'),
  name: require('./commands/name.js'),
}
