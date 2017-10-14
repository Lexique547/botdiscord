// Backend
const Backend = require('statsbot-backend')

// Commands
const Invite = require('./commands/invite')
const Channels = require('./commands/channels')

const Registry = new Backend.Registry()
  .addCommand(Invite)
  .addCommand(Channels)

module.exports = Registry
