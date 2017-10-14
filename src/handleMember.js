// JSDoc Typing
const Backend = require('statsbot-backend')
const Discord = require('discord.js')
const BackendClient = Backend.Client // eslint-disable-line
const DiscordMember = Discord.GuildMember // eslint-disable-line

// Local Dependencies
const { getData } = require('./accessDB')

/**
 * Handle Member Update
 * @param {DiscordMember} member Member Object
 * @param {boolean} [announce] Announce to Channel?
 */
const handleMember = async (member, announce = false) => {
  const settings = await getData(member.guild.id)
  try {
    let activity = member.presence.activity
    let roles = settings.roles.map(x => member.guild.roles.get(x))
    if (activity !== null && activity.type === 'STREAMING') {
      for (let role of roles) { member.addRole(role) }
      if (announce) {
        // Announce to channels
        // TODO
      }
    } else {
      for (let role of roles) { member.removeRole(role) }
    }
  } catch (err) {
    // Silently Fail
    console.error(err)
  }
}

module.exports = handleMember
