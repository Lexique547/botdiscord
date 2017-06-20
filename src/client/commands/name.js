/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  if (command.arguments.length === 0) {
    command.msg.channel.send(':x: You didn\'t specify a name!')
  } else {
    let username = command.arguments[0]
    command.bot.user.setUsername(username)
      .then(() => { command.msg.channel.send(`:white_check_mark: Name changed to **${username}**.`) })
      .catch(() => { command.msg.channel.send(':x: Error changing name! Try again...') })
  }
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  owner: true,
  description: 'Changes the bots Discord username.',
  arguments: [],
}
