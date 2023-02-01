const mockGetConsoles = jest.fn();
const mockSaveConsole = jest.fn();
const mockDeleteConsole = jest.fn();

jest.mock('../../src/clients/console-client', () => ({
  getConsoles: mockGetConsoles,
  saveConsole: mockSaveConsole,
  deleteConsole: mockDeleteConsole
}));

import { Console } from '@tinystacks/ops-model';
import ConsoleController from '../../src/controllers/console-controller';

describe('console controller tests', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  it('getConsole', async () => {
    await ConsoleController.getConsoles();
    expect(mockGetConsoles).toBeCalled();
  });
  it('postConsole', async () => {
    const requestBody: Console = {
      name: 'mock-console',
      pages: [],
      providers: [],
      widgets: []
    }
    await ConsoleController.postConsole(requestBody);
    expect(mockSaveConsole).toBeCalled();
    expect(mockSaveConsole).toBeCalledWith(requestBody.name, requestBody);
  });
  it('putConsole', async () => {
    const requestBody: Console = {
      name: 'mock-console',
      pages: [],
      providers: [],
      widgets: []
    }
    await ConsoleController.putConsole('mock-console-2', requestBody);
    expect(mockSaveConsole).toBeCalled();
    expect(mockSaveConsole).toBeCalledWith('mock-console-2', {
      ...requestBody,
      name: 'mock-console-2'
    });
  });
  it('deleteConsole', async () => {
    await ConsoleController.deleteConsole('mock-console');
    expect(mockDeleteConsole).toBeCalled();
    expect(mockDeleteConsole).toBeCalledWith('mock-console');
  });
});