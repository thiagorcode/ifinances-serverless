import { handler } from '@functions/getByUserId/handler';
import { findByUserIdService } from '@services/findByUserId.service';
import { Database } from '@shared/database';
import { mockCallback, mockContext } from '../../mock/defaultVars';
import { constructAPIGatewayEvent } from '../../mock/helpers';

jest.mock('@shared/database', () => {
  const mockCreateConnection = jest.fn();
  const mockDatabase = {
    createConnection: mockCreateConnection,
  };
  return {
    Database: jest.fn().mockImplementation(() => mockDatabase),
  };
});
const mockUserId = '123';

const mockUsers = {
  id: mockUserId,
  username: 'johndoe',
  email: 'johndoe@example.com',
  password: 'hash123',
  isActive: true,
  isPasswordChange: false,
  dtCreated: new Date(),
  dtUpdated: new Date(),
};
jest.mock('../../../repository/users.repository', () => {
  return {
    UsersRepository: jest.fn().mockImplementation(() => {
      return {
        findByUserId: jest.fn(),
      };
    }),
  };
});

describe('Unit test for getById handler', () => {
  const mockEvent = constructAPIGatewayEvent();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should mock is correct', async () => {
    const mockDatabase = new Database();
    const mockFindByUserId = findByUserIdService();

    expect(mockDatabase).toBeDefined();
    expect(mockFindByUserId).toBeDefined();
  });

  it('should return 200 and the users found by the given userId', async () => {
    const mockDatabase = new Database();
    mockEvent.pathParameters = { id: mockUserId };

    const findByUserId = findByUserIdService();
    jest.spyOn(findByUserId, 'execute').mockResolvedValueOnce(mockUsers as any);
    // console.log(await findByUserId.execute(mockUserId));
    const result = await handler(mockEvent, mockContext);
    // expect(findByUserId.execute).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Consulta realizada com sucesso',
        data: mockUsers,
      }),
    });
    // expect(mockFindByUserId.execute).toHaveBeenCalledTimes(1);
  });

  it('should return 400 when id parameter is not sent', async () => {
    // Corrigi teste depois
    mockEvent.pathParameters = {};

    const result = await handler(mockEvent, mockContext);
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Não foi enviado o parâmetro ID!',
      }),
    });
  });

  it('should return 400 when not find user', async () => {
    // Corrigi teste depois
    mockEvent.pathParameters = { id: mockUserId };

    const findByUserId = findByUserIdService();
    jest.spyOn(findByUserId, 'execute').mockResolvedValueOnce(undefined);

    const result = await handler(mockEvent, mockContext);
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Usuário não existe!',
      }),
    });
  });
});
