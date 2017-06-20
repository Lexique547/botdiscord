/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  let url = `<https://discordapp.com/oauth2/authorize?client_id=${command.bot.user.id}&scope=bot&permissions=335612928>`
  command.msg.author.send(url)
    .catch(err => {
      if (err.code === 50007) {
        command.msg.channel.send(url)
          .catch(() => {
            // oh no
          })
      }
    })
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  admin: false,
  description: 'DMs you a link to invite the bot to your server.',
  arguments: [],
}
