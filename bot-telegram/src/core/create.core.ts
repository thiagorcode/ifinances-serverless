import DynamoDBRepositoryInterface from '../repository/interface/dynamodbRepository.interface'

// TODO: Aplicar injenção de depedências
export class CreateCore {
  constructor(private userRepository: DynamoDBRepositoryInterface) {}
}
