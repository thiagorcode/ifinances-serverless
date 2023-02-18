import { formatJSONResponse } from '@libs/api-gateway';
import { Database } from '@shared/database';
import { Users } from '@shared/database/entities/users.entity';
import { mockCallback, mockContext } from '../../mock/defaultVars';
import { constructAPIGatewayEvent } from '../../mock/helpers';
import { findByUserIdService } from '@services/findByUserId.service';
import handler from '../../../functions/getById';

jest.mock('@shared/database');
jest.mock('@libs/api-gateway');
jest.mock('@services/findByUserId.service');

describe('Unit test for getById handler', function () {
  const mockEvent = constructAPIGatewayEvent();
  const mockFindByUserId = findByUserIdService.prototype as jest.MockedFunction<typeof findByUserIdService>;
  const mockDatabase = Database as jest.MockedClass<typeof Database>;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the users found by the given userId', async () => {
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
    } as Users;

    mockFindByUserId.prototype.execute.mockResolvedValueOnce(mockUsers);
    mockDatabase.prototype.createConnection.mockResolvedValueOnce();
    mockEvent.pathParameters = { id: mockUserId };

    const result = await handler(mockEvent, mockContext, mockCallback);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Consulta realizada com sucesso',
        data: mockUsers,
      }),
    });
    expect(mockDatabase.prototype.createConnection).toHaveBeenCalledTimes(1);
    expect(mockFindByUserId.prototype.execute).toHaveBeenCalledTimes(1);
    expect(mockFindByUserId.prototype.execute).toHaveBeenCalledWith(mockUserId);
  });
});
