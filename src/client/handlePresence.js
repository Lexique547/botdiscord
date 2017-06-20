// Package Dependencies
const log = require('fancylog')

// Local Dependencies
const dbSetup = require('./dbSetup.js')

/**
 * @param {Discord.Member} member - Discord Member Object
 * @param {Discord.Member} old - Discord Old Member Object
 * @param {Discord.Client} bot - Bot Client
 */
module.exports = (member, old, bot) => {
  // Get the current DB state
  dbSetup.accessDB()
    .then(db => {
      // Get DB Object of current server
      let dbObj = db[member.guild.id]

      // Check if Role Name isn't blank
      if (dbObj === undefined || dbObj.roleName === undefined) {
        // IGNORE
      } else if (dbObj.roleName !== '') {
        // Check if the memeber is streaming
        if (member.presence.game !== null && member.presence.game.type === 1) {
          // Add the role
          member.addRole(member.guild.roles.filter(obj => obj.name === dbObj.roleName).first())
            .catch(err => log.e(err))

          // If set to announce games
          if (dbObj.announceStreams) {
            // Check if was streaming before
            if (old !== null && old.presence.game !== null && old.presence.game.type === 1) {
              // If yeah
              // Do Nothing
            } else {
              // Otherwise

              // Define the output message
              let output = ''
              // If to ping everyone
              if (dbObj.announceEveryone) output += `@everyone\n`
              output += `<@${member.id}> just went live!\n${member.presence.game.url}`

              const channel = bot.channels.find(a => a.id === dbObj.announceChannel)
              channel.send(output)

              db[member.guild.id].currentStreamers[member.id] = true
            }
          }
        } else {
          // If they're not, try to remove the role
          member.removeRole(member.guild.roles.filter(obj => obj.name === dbObj.roleName).first())
            .catch(err => log.e(err))
        }
      }
    })
    // Handle Errors
    .catch(err => log.e(err))
}
