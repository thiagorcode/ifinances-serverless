export const parseCommand = (message: string) => {
  const tokens = message.split(' ')
  if (!tokens[0].match(/^\//)) return null
  console.debug('tokens', tokens)
  const command: { [key: string]: string[] } = {}
  const cmd = tokens.shift()
  console.debug('cmd', cmd)
  if (!cmd) return null
  const match = cmd.match(/\/(\w*)/)
  console.debug('match', match)
  if (!match) return null

  if (match.length > 0) {
    const key: string = match[1]
    command[key] = tokens
  }
  console.debug('return command', command)

  return { command, cmd, tokens }
}
