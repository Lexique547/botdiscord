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
        const status = db[command.msg.guild.id].announceEveryone ? 'enabled' : 'disabled'
        command.msg.channel.send(`:white_check_mark: **Announce Everyone:** Everyone pings are currently ${status}.`)
      })
      .catch(() => {
        command.msg.channel.send(':x: **Announce Everyone:** Something went wrong. Try Again.')
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

          db[command.msg.guild.id].announceEveryone = state
          return db
        })
        .then(dbSetup.saveDB)
        .then(dbSetup.accessDB)
        .then(db => {
          const status = db[command.msg.guild.id].announceEveryone ? 'enabled' : 'disabled'
          command.msg.channel.send(`:white_check_mark: **Announce Everyone:** Everyone pings are now ${status}.`)
        })
        .catch(() => {
          command.msg.channel.send(':x: **Announce Everyone:** Something went wrong. Try Again.')
        })
    } else {
      command.msg.channel.send(':x: **Announce Everyone:** Invalid Argument. Please specify `true` or `false`')
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
  description: 'Defines whether stream announcements should ping `@everyone`.',
  arguments: ['[t/f]'],
}
