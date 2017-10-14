// Backend
const Backend = require('statsbot-backend')

// Commands
const Invite = require('./commands/invite')
const Channels = require('./commands/channels')
const Roles = require('./commands/roles')

const Registry = new Backend.Registry()
  .addCommand(Invite)
  .addCommand(Channels)
  .addCommand(Roles)

module.exports = Registry
