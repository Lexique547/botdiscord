// Local Dependencies
const dbSetup = require('../dbSetup.js')

/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  if (command.arguments.length === 0) {
    dbSetup.accessDB()
      .then(db => {
        const status = db[command.msg.guild.id].announceStreams ? 'enabled' : 'disabled'
        command.msg.channel.send(`:white_check_mark: **Announce Streams:** Announcements are currently ${status}.`)
      })
      .catch(() => {
        command.msg.channel.send(':x: **Announce Streams:** Something went wrong. Try Again.')
      })
  } else {
    const arg = command.arguments[0].toLowerCase()
    if (
      arg === 'true' ||
      arg === 't' ||
      arg === 'yes' ||
      arg === 'y' ||
      arg === 'false' ||
      arg === 'f' ||
      arg === 'no' ||
      arg === 'n'
    ) {
      dbSetup.accessDB()
        .then(db => {
          let state
          if (
            arg === 'true' ||
            arg === 't' ||
            arg === 'yes' ||
            arg === 'y'
          ) state = true
          else state = false

          db[command.msg.guild.id].announceStreams = state
          return db
        })
        .then(dbSetup.saveDB)
        .then(dbSetup.accessDB)
        .then(db => {
          const status = db[command.msg.guild.id].announceStreams ? 'enabled' : 'disabled'
          command.msg.channel.send(`:white_check_mark: **Announce Streams:** Announcements are currently ${status}.`)
        })
        .catch(() => {
          command.msg.channel.send(':x: **Announce Streams:** Something went wrong. Try Again.')
        })
    } else {
      command.msg.channel.send(':x: **Announce Streams:** Invalid Argument. Please specify `true` or `false`')
    }
  }
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  admin: true,
  description: 'Sets the announcement channel to the channel in which the command is used.',
  arguments: ['[t/f]'],
}
