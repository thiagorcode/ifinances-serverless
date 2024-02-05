import jwt from 'jsonwebtoken'

export class AuthorizerCore {
  async execute(headerToken?: string) {
    console.info('init validateAuthorizerToken service')
    try {
      if (!headerToken) {
        return false
      }
      const token = headerToken.split(' ')[1]

      // const kid = jwt.decode(token, { complete: true })?.['header']['kid']
      const jwtSecret = 'teste123'
      const verify = jwt.verify(token, jwtSecret)
      console.info(verify)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
