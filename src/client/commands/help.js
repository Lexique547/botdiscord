// Package Dependencies
const fs = require('fs')
const path = require('path')

// Bot Metadata
const BOT_AUTHOR = 'lolPants'
const BOT_NAME = 'Stream Role Bot'

/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  // Local Dependencies
  const commands = require('../commands.js')
  const package = require('../../../package.json')
  const config = require('../../shared/config.js')

  // Start Bot Typing
  command.msg.channel.startTyping()

  // Define Sorter Arrays
  let cmds = [], nsfwCmds = [], adminCmds = []

  // Run through commands and sort
  for (let i in commands) {
    let cmd = commands[i]
    cmd.name = i

    if (cmd.admin) {
      adminCmds.push(cmd)
    } else if (cmd.nsfw) {
      nsfwCmds.push(cmd)
    } else {
      cmds.push(cmd)
    }
  }

  // Sort Arrays
  cmds.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
    else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
    else return 0
  })
  nsfwCmds.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
    else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
    else return 0
  })
  adminCmds.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
    else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
    else return 0
  })

  // Define Final String
  let final = ''

  // Main Commands
  if (cmds.length > 0) {
    final += '**Commands**\n'
    final += '_These can be used anywhere._\n\n'
    for (let cmd of cmds) {
      // List Command Name
      final += `\`${config.prefix}\` `
      final += `\`${cmd.name}\` `

      // List Arguments (if available)
      if (cmd.arguments !== undefined && cmd.arguments.length > 0) {
        for (let arg of cmd.arguments) {
          final += `\`${arg}\` `
        }
      }

      // List Description (if available)
      if (cmd.description !== undefined) {
        final += ` - ${cmd.description}`
      }

      final += '\n'
    }
  }

  // NSFW Commands
  if (nsfwCmds.length > 0) {
    final += '\n**NSFW Commands**\n'
    final += '_These can only be used in NSFW channels._\n\n'
    for (let cmd of nsfwCmds) {
      // List Command Name
      final += `\`${config.prefix}\` `
      final += `\`${cmd.name}\` `

      // List Arguments (if available)
      if (cmd.arguments !== undefined && cmd.arguments.length > 0) {
        for (let arg of cmd.arguments) {
          final += `\`${arg}\` `
        }
      }

      // List Description (if available)
      if (cmd.description !== undefined) {
        final += ` - ${cmd.description}`
      }

      final += '\n'
    }
  }

  // Admin Commands
  if (adminCmds.length > 0) {
    final += '\n**Admin Commands**\n'
    final += '_These can only be used by the bot admin._\n\n'
    for (let cmd of adminCmds) {
      // List Command Name
      final += `\`${config.prefix}\` `
      final += `\`${cmd.name}\` `

      // List Arguments (if available)
      if (cmd.arguments !== undefined && cmd.arguments.length > 0) {
        for (let arg of cmd.arguments) {
          final += `\`${arg}\` `
        }
      }

      // List Description (if available)
      if (cmd.description !== undefined) {
        final += ` - ${cmd.description}`
      }

      final += '\n'
    }
  }

  // Read Template File
  fs.readFile(path.join(__dirname, '..', '..', 'shared', 'templates', 'help.txt'), 'utf8', (err, data) => {
    // Handle Error
    if (err) return console.error(err)

    // Replace Templates
    data = data.replace('{{help_text}}', final)
    data = data.replace('{{botname}}', BOT_NAME)
    data = data.replace('{{author}}', BOT_AUTHOR)
    data = data.replace('{{desc}}', package.description)

    // Send Message and Stop Typing
    command.msg.channel.send(data)
    command.msg.channel.stopTyping()
  })
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  admin: false,
  description: 'Lists all commands. You\'re using it right now!',
  arguments: [],
}
