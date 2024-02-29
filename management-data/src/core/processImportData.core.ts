import { TransactionsCategorySchema } from '../shared/schemas'
import CategoryDatabaseRepositoryInterface from '../repository/interface/categoryDatabaseRepository.interface'
import { ImportDataTypes } from '../shared/types'

export class ProcessImportDataCore {
  constructor(private categoryRepository: CategoryDatabaseRepositoryInterface) {}

  async execute(data: ImportDataTypes): Promise<void> {
    console.info('call ProcessImportDataCore')
    // Envio de um SQS Update para o User quando verificar que é o primeiro acesso
    if (data.category) {
      for (const category of data.category) {
        const categoryParsed = TransactionsCategorySchema.parse(category)
        await this.categoryRepository.create(categoryParsed)
      }
    }
  }
}
