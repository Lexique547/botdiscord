/*
  Stream Role Bot
  By Jack Baron (me@jackbaron.com)
  Copyright (c) Jack Baron 2017
*/

// Bot Config
const config = require('../shared/config.js')

// Package Dependencies
const path = require('path')
const exitHook = require('async-exit-hook')
const Discord = require('discord.js')
const bot = new Discord.Client()
const log = require('fancylog')

// Local Dependencies
const dbSetup = require('./dbSetup.js')
const handlePresence = require('./handlePresence.js')

// Call Database Setup
dbSetup.main()

// Login to Discord
bot.login(config.token)

/**
 * Set Bots 'Now Playing' Status
 */
const setGame = () => {
  // Select random status from config array
  let status = config.statuses[Math.floor(Math.random() * config.statuses.length)]
  // Set status
  bot.user.setGame(status)
}

/**
 * Ready Event Handler
 * Triggered when the bot connects to Discord
 */
bot.on('ready', () => {
  // Signal Readystate
  log.i('Connected to Discord!')

  // Status Rotation
  // Call Once
  setGame()
  // Loop every 15 seconds
  setInterval(() => { setGame() }, 15 * 1000)

  // Avatar Change Logic
  // Try (handles errors)
  try {
    // Set Avatar to configured file
    bot.user.setAvatar(path.join('src/shared/avatar', config.avatar))
      .catch(() => {
        // Do nothing if API error
      })
  } catch (ex) {
    // If error (missing file)
    // Log
    log.e('Avatar not found. Check config.js')
  }

  // Start Custom Logic

  // Save guild array
  dbSetup.updateGuilds(bot.guilds.array().map(o => o.id))
})

/**
 * Guild Create Handler
 * Triggered when the bot joins a new guild
 */
bot.on('guildCreate', guild => {
  // Add the guild to the DB
  dbSetup.updateGuilds([guild.id])
})

bot.on('presenceUpdate', (old, member) => {
  handlePresence(member)
})

/**
 * Message Event Handler
 * Triggered when the bot sees a new message
 */
bot.on('message', msg => {
  // Ignore own input
  if (msg.author.bot) return

  // Command Handling
  // This logic is pretty custom, I won't try to explain all of it
  let command
  if (msg.content.startsWith(`<@${bot.user.id}>`) || msg.content.startsWith(`<@!${bot.user.id}>`)) {
    command = handleCommand(msg)
  } else if (msg.content.toLowerCase().startsWith(config.prefix.toLowerCase())) {
    command = handleCommand(msg, config.prefix.toLowerCase())
  } else {
    command = null
  }

  if (command !== null) {
    const commands = require('./commands.js')
    if (commands[command.trigger] === undefined) {
      // Command Doesn't Exist
      command.msg.channel.send(':x: Command Doesn\'t Exist.')
    } else {
      // Command Exists
      let selectedCommand = commands[command.trigger]
      if (selectedCommand.nsfw) {
        if (command.msg.channel.nsfw) {
          selectedCommand.func(command)
        } else {
          command.msg.channel.send(':x: NSFW commands can only be used in NSFW Channels.')
        }
      } else if (selectedCommand.admin) {
        if (config.ownerId === command.msg.author.id) {
          selectedCommand.func(command)
        } else {
          command.msg.channel.send(':x: You do not have permission to do that.')
        }
      } else {
        selectedCommand.func(command)
      }
    }
  }
})

/**
 * Splits a raw string of arguments into an array
 * @param {string} raw - Raw Parameters
 * @returns {string}
 */
const rawHandler = raw => {
  // Also mostly custom logic.
  // Basically splits a command string into parts
  // EG: a b "c d"
  // Becomes
  // ['a', 'b', 'c d']
  let arr = raw.split(' ')

  let newArr = []
  let multi = false
  for (let arg of arr) {
    if (multi !== true) {
      if (arg[0] === '"' && arg[arg.length - 1] !== '"') {
        multi = true
        newArr.push(arg.slice(1))
      } else if (arg[0] === '"' && arg[arg.length - 1] === '"') {
        newArr.push(arg.slice(1, -1))
      } else {
        newArr.push(arg)
      }
    } else {
      let str
      if (arg.slice(-1) === '"') {
        multi = false
        str = arg.slice(0, -1)
      } else {
        str = arg
      }
      newArr[newArr.length - 1] += ` ${str}`
    }
  }
  if (newArr.length === 1 && newArr[0] === '') {
    newArr = []
  }
  return newArr
}

/**
 * Handle Command Input from Bot
 * @param {Discord.Message} msg - Discord Message to Handle
 * @param {string} [prefix] - Prefix of Bot
 * @returns {string}
 */
const handleCommand = (msg, prefix = null) => {
  // CUUUUSTOOOM LOOOGIC
  // Woop
  let raw
  if (prefix === null) {
    raw = msg.content
      .split(' ')
      .slice(1)
      .join(' ')
  } else {
    raw = msg.content
      .split(' ')
      .slice(prefix.split(' ').length)
      .join(' ')
  }

  let command = {
    msg: msg,
    raw: raw,
    trigger: raw.split(' ').shift(),
    prefix: prefix,
    arguments: rawHandler(raw.split(' ').slice(1).join(' ')),
    bot: bot,
  }

  return command
}

/**
 * Logout Function
 * Handles CTRL+C and PM2
 */
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
