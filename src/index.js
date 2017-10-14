// Package Dependencies
const Backend = require('statsbot-backend')
const exitHook = require('async-exit-hook')

// Local Dependencies
const Registry = require('./registry')

// Environment Variables
const { TOKEN, PREFIX, OWNER, PREFIX_SPACE } = process.env

const bot = new Backend.Client()
  // Meta Data
  .setName('Stream Role Bot')
  .setAuthor('lolPants#2319')
  .setDescription('Automatically assigns / removes a role when someone starts / stops streaming.')
  // Command Registries
  .addRegistry(Backend.StandardRegistry)
  .addRegistry(Registry)
  // Bot Runtime
  .setPrefix(PREFIX)
  .setIgnorePrefixSpacing(PREFIX_SPACE === undefined)
  .addOwner(OWNER)

bot.login(TOKEN)

/**
 * Logout Function
 * Handles CTRL+C and PM2
 */
exitHook(async exit => {
  // Check if logged in
  if (bot.readyAt !== null) {
    try {
      await bot.destroy()
      exit()
    } catch (err) { exit() }
  } else { exit() }
})
