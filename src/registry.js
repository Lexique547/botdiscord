// Backend
const Backend = require('statsbot-backend')

// Commands
const Invite = require('./commands/invite')
const Channels = require('./commands/channels')
const Roles = require('./commands/roles')
const SetPing = require('./commands/setPing')

const Registry = new Backend.Registry()
  .addCommand(Invite)
  .addCommand(Channels)
  .addCommand(Roles)
  .addCommand(SetPing)

module.exports = Registry
