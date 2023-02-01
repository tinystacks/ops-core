const mockReadFileSync = jest.fn();

jest.mock('fs', () => ({
  readFileSync: mockReadFileSync
}));

import FsUtils from '../../src/utils/fs-utils';

describe('FsUtils tests', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
    jest.spyOn(global.console, 'warn').mockImplementation(jest.fn());
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('tryToReadFile', () => {
    it('logs error and returns undefined if an error is thrown', () => {
      const mockError = new Error('Error!');
      mockReadFileSync.mockImplementationOnce(() => { throw mockError; });

      const file = FsUtils.tryToReadFile('./mock');

      expect(mockReadFileSync).toBeCalled();
      expect(console.error).toBeCalled();
      expect(console.error).toBeCalledWith('An error occured when reading the file specified at ./mock!', mockError);
      expect(file).toBeUndefined();
    });
    
    it('logs warning and returns undefined if the file is nil', () => {
      mockReadFileSync.mockReturnValueOnce(undefined);

      const file = FsUtils.tryToReadFile('./mock');

      expect(mockReadFileSync).toBeCalled();
      expect(console.warn).toBeCalled();
      expect(console.warn).toBeCalledWith('The file specified at ./mock has no contents or does not exist!');
      expect(file).toBeUndefined();
    });

    it('returns file contents if successfully read', () => {
      const contents = Buffer.from('mock');
      mockReadFileSync.mockReturnValueOnce(contents);

      const file = FsUtils.tryToReadFile('./mock');

      expect(mockReadFileSync).toBeCalled();
      expect(console.warn).not.toBeCalled();
      expect(console.error).not.toBeCalled();
      expect(file).toEqual(contents);
    });
  });
});