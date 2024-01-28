export const parseCommand = (message: string) => {
  const tokens = message.split(' ')
  if (!tokens[0].match(/^\//)) return null

  const command: { [key: string]: string[] } = {}
  const cmd = tokens.shift()

  if (!cmd) return null
  const match = cmd.match(/\/(\w*)/)

  if (!match) return null

  if (match.length > 0) {
    const key: string = match[1]
    command[key] = tokens
  }
  console.info('return', { command, cmd, tokens })

  return { command, cmd, tokens }
}
