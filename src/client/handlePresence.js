// Package Dependencies
const log = require('fancylog')

// Local Dependencies
const dbSetup = require('./dbSetup.js')

/**
 * @param {Discord.Member} member - Discord Member Object
 */
module.exports = member => {
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
        // if (member.presence.game !== null && member.presence.game.type === 1) {
        if (member.presence.status === 'idle') {
          // Add the role
          member.addRole(member.guild.roles.filter(obj => obj.name === dbObj.roleName).first())
            .catch(err => log.e(err))
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
