// Local Dependencies
const dbSetup = require('../dbSetup.js')

/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  dbSetup.accessDB()
    .then(db => {
      db[command.msg.guild.id].announceChannel = command.msg.channel.id
      return db
    })
    .then(dbSetup.saveDB)
    .then(() => {
      command.msg.channel.send(`:white_check_mark: **Set Channel:** Channel set to \`#${command.msg.channel.name}\``)
    })
    .catch(() => {
      command.msg.channel.send(':x: **Set Channel:** Something went wrong. Try Again.')
    })
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  admin: true,
  description: 'Sets the announcement channel to the channel in which the command is used.',
  arguments: [],
}
