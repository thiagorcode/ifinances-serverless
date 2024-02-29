import { ProcessImportDataCore } from '../core'
import { CategoryDatabaseRepository } from '../repository/category.repository'
import { ImportDataTypes } from '../shared/types'

export const handler = async (event: ImportDataTypes) => {
  console.info('Event :: ', JSON.stringify(event))
  const categoryRepository = new CategoryDatabaseRepository()
  const processImportDataCore = new ProcessImportDataCore(categoryRepository)

  await processImportDataCore.execute(event)
}
