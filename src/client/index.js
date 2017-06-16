/*
  Electra 2
  By Jack Baron (me@jackbaron.com)
  Copyright (c) Jack Baron 2017
*/

// Package Dependencies
const log = require('fancylog')
const exitHook = require('async-exit-hook')
const Discord = require('discord.js')
const bot = new Discord.Client()

// Bot Config
const config = require('../shared/config.js')

bot.login(config.token)

bot.on('ready', () => {
  log.i('Connected to Discord!')

  // For all currently listed guilds
  for (let guild of bot.guilds.array()) {
    // Check if the role exists
    if (guild.roles.filter(obj => obj.name === config.roleName).first() === null ||
    guild.roles.filter(obj => obj.name === config.roleName).first() === undefined) {
      // Show an error if it doesn't
      log.e(`Role doesn't exist on Server: ${guild.name}`)
    }

    // Iterate over every member of the current server
    for (let member of guild.members.array()) {
      // If they're live
      if (member.presence.game !== null && member.presence.game.type === 1) {
        // Add the role
        member.addRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
      } else {
        // If they're not, try to remove / remove the role
        member.removeRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
      }
    }
  }
})

// Every time a user updates their status
bot.on('presenceUpdate', (oldMember, member) => {
  // If they're live
  if (member.presence.game !== null && member.presence.game.type === 1) {
    // Add the role
    member.addRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
  } else {
    // If they're not, try to remove / remove the role
    member.removeRole(member.guild.roles.filter(obj => obj.name === config.roleName).first()).catch(console.error)
  }
})

// Handle on process exit
exitHook(exit => {
  // Check if bot is logged in
  if (bot.readyAt !== null) {
    // If the bot is logged in, destroy the session
    bot.destroy()
      // Wait for it to finish then exit
      .then(exit)
      // If it fails to destroy, exit anyway
      .catch(err => {
        console.error(err)
        exit()
      })
  } else {
    // If not, just quit
    exit()
  }
})
