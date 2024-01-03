export type UsersTypes = {
  salt: string
  password: string
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  isActive: boolean
  isPasswordChange: boolean
  dtCreated: string
  dtUpdated: string
  botPreferences?: {
    id: string
    username: string
  }[]
}
