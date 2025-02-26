import { CategoryDatabaseRepository } from '../repository/categoryDatabase.repository'
import { AppErrorException, formatResponse } from '../utils'
import { FindAllCore } from '../core/find.core'

export const handler = async (event: any) => {
  try {
    console.debug('Event:', event)

    const repository = new CategoryDatabaseRepository()
    const findAllCore = new FindAllCore(repository)

    const category = await findAllCore.execute()
    return formatResponse(200, {
      message: 'Buscas realizada com sucesso!',
      category,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof AppErrorException) {
      return null
    }
    return null
  }
}
