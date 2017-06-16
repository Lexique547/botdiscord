const config = require('./config.js')

const exitHook = require('async-exit-hook')
const Discord = require('discord.js')
const bot = new Discord.Client()

bot.login(config.token)

bot.on('ready', () => {
  for (let guild of bot.guilds.array()) {
    if (guild.roles.filter(obj => obj.name === config.roleName).first() === null ||
    guild.roles.filter(obj => obj.name === config.roleName).first() === undefined) {
      console.log('role doesn\'t exist')
    }
    for (let member of guild.members.array()) {
      if (member.presence.game !== null && member.presence.game.type === 1) {
        member.addRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
      } else {
        member.removeRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
      }
    }
  }
})

bot.on('presenceUpdate', (oldMember, member) => {
  if (member.presence.game !== null && member.presence.game.type === 1) {
    member.addRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
  } else {
    member.removeRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
  }
})

exitHook(exit => {
  // Check if logged in
  if (bot.readyAt !== null) {
    bot.destroy()
      .then(exit)
      .catch(err => {
        console.error(err)
        exit()
      })
  } else {
    exit()
  }
})
