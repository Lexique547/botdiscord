/**
 * Command Function
 * @param {Object} command - Command Object
 */
const mainFunc = command => {
  if (command.arguments.length === 0) {
    setNickname(command)
  } else {
    setNickname(command, command.arguments[0])
  }
}

/**
 * Sets the bot's nickname
 * @param {Object} command - Command Object
 * @param {string} nickname - Nickname to set to
 */
const setNickname = (command, nickname = null) => {
  command.msg.guild.fetchMember(command.bot.user)
    .then(member => {
      if (member.hasPermission('CHANGE_NICKNAME') || member.hasPermission('MANAGE_NICKNAMES')) {
        member.setNickname(nickname)
          .then(() => {
            if (nickname === null) command.msg.channel.send(`:white_check_mark: Nickname reset!`)
            else command.msg.channel.send(`:white_check_mark: Nickname changed to **${nickname}**.`)
          })
          .catch(() => { command.msg.channel.send(':x: Error changing nickname! Try again...') })
      } else {
        command.msg.channel.send(':x: I don\'t have permission to do that!')
      }
    })
}

/**
 * Help Command
 */
module.exports = {
  func: mainFunc,
  nsfw: false,
  admin: true,
  description: 'Changes the bots server nickname.',
  arguments: [],
}
