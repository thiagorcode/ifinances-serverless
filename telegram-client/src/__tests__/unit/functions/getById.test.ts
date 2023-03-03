import { formatJSONResponse } from '@libs/api-gateway';
import handler from '../../../functions/getById';
import { findByUserIdService } from '@services/findByUserId.service';
import { Database } from '@shared/database';
import { Users } from '@shared/database/entities/users.entity';
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
        findByUserId: jest.fn().mockReturnValue(mockUsers),
      };
    }),
  };
});

describe('Unit test for getById handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockEvent = constructAPIGatewayEvent();

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

    const result = await handler(mockEvent, mockContext, mockCallback);
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
});
