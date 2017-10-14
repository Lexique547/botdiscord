// Backend
const Backend = require('statsbot-backend')

// Commands
const Invite = require('./commands/invite')

const Registry = new Backend.Registry()
  .addCommand(Invite)

module.exports = Registry
