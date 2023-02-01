const mockResolve = jest.fn();
const mockTryToReadFile = jest.fn();
const mockLoad = jest.fn();
const mockDump = jest.fn();
const mockWriteFileSync = jest.fn();

jest.mock('../../../src/utils/fs-utils.ts', () => ({
  tryToReadFile: mockTryToReadFile
}));

jest.mock('path', () => ({
  resolve: mockResolve
}));

jest.mock('js-yaml', () => ({
  load: mockLoad,
  dump: mockDump
}));

jest.mock('fs', () => ({
  writeFileSync: mockWriteFileSync
}));

import { Console as ConsoleType } from '@tinystacks/ops-model';
import LocalConsoleClient from '../../../src/clients/console-client/local';
import HttpError from 'http-errors';
import Console from '../../../src/classes/console';

describe('local console client tests', () => {
  beforeEach(() => {
    delete process.env.CONFIG_PATH;
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('getLocalConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      let thrownError;
      try {
        await LocalConsoleClient.getLocalConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch consoles! No value was found for CONFIG_PATH!'));
      }
    });
    it('throws NotFound if file returns undefined', async () => {
      const mockConfigPath = './mock.yml';
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await LocalConsoleClient.getLocalConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).toBeCalled();
        expect(mockResolve).toBeCalledWith(mockConfigPath);
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.NotFound('Cannot fetch consoles! Config file ./mock.yml not found!'));
      }
    });
    it('returns Console on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole: ConsoleType = {
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      };
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(Buffer.from('Console: '));
      mockLoad.mockReturnValueOnce({
        Console: mockConsole
      });
      
      const result = await LocalConsoleClient.getLocalConsole();
      
      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockTryToReadFile).toBeCalled();
      expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
      expect(mockLoad).toBeCalled();
      expect(mockLoad).toBeCalledWith('Console: ');
      expect(result).toEqual(mockConsole);
    });
    it('throws InternalServerError if yaml cannot be loaded', async () => {
      const mockConfigPath = './mock.yml';
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(Buffer.from('Console: '));
      mockLoad.mockReturnValueOnce(undefined);
      let thrownError;
      try {
        await LocalConsoleClient.getLocalConsole();
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).toBeCalled();
        expect(mockResolve).toBeCalledWith(mockConfigPath);
        expect(mockTryToReadFile).toBeCalled();
        expect(mockTryToReadFile).toBeCalledWith(mockConfigPath);
        expect(mockLoad).toBeCalled();
        expect(mockLoad).toBeCalledWith('Console: ');
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot fetch consoles! The contents of the config file was empty or invalid!'));
      }
    });
  });
  describe('saveLocalConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      const mockConsole = Console.fromObject({
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      });
      let thrownError;
      try {
        await LocalConsoleClient.saveLocalConsole(mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot save console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('writes to file and returns saved Console on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = Console.fromObject({
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      });
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      mockTryToReadFile.mockReturnValueOnce(Buffer.from('Console: '));
      mockDump.mockReturnValueOnce('Console: ');
      jest.spyOn(LocalConsoleClient, 'getLocalConsole').mockResolvedValueOnce(mockConsole);
      
      const result = await LocalConsoleClient.saveLocalConsole(mockConsole);
      
      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockDump).toBeCalled();
      expect(mockDump).toBeCalledWith(Console.toYaml(mockConsole));
      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledWith(mockConfigPath, 'Console: ');
      expect(LocalConsoleClient.getLocalConsole).toBeCalled();
      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = Console.fromObject({
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      });
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockWriteFileSync.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(LocalConsoleClient, 'getLocalConsole').mockResolvedValueOnce(mockConsole);
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await LocalConsoleClient.saveLocalConsole(mockConsole);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockDump).toBeCalled();
        expect(mockWriteFileSync).toBeCalled();
        expect(LocalConsoleClient.getLocalConsole).not.toBeCalled();
        expect(global.console.error).toBeCalled();
        expect(global.console.error).toBeCalledWith('Failed to save local console mock-console!', mockError);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
  describe('deleteLocalConsole', () => {
    it('throws InternalServerError if CONFIG_PATH is not set', async () => {
      let thrownError;
      try {
        await LocalConsoleClient.deleteLocalConsole('mock-console');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockResolve).not.toBeCalled();
        expect(mockTryToReadFile).not.toBeCalled();
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(HttpError.InternalServerError('Cannot delete console mock-console! No value was found for CONFIG_PATH!'));
      }
    });
    it('overwrites config file with empty string and returns previous Console state on success', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = Console.fromObject({
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      });
      process.env.CONFIG_PATH = mockConfigPath;
      mockResolve.mockReturnValueOnce(mockConfigPath);
      jest.spyOn(LocalConsoleClient, 'getLocalConsole').mockResolvedValueOnce(mockConsole);
      
      const result = await LocalConsoleClient.deleteLocalConsole('mock-console');
      
      expect(LocalConsoleClient.getLocalConsole).toBeCalled();
      expect(mockResolve).toBeCalled();
      expect(mockResolve).toBeCalledWith(mockConfigPath);
      expect(mockWriteFileSync).toBeCalled();
      expect(mockWriteFileSync).toBeCalledWith(mockConfigPath, '');
      expect(result).toEqual(mockConsole);
    });
    it('logs and re-throws errors', async () => {
      const mockConfigPath = './mock.yml';
      const mockConsole = Console.fromObject({
        name: 'mock-console',
        pages: [],
        providers: [],
        widgets: []
      });
      const mockError = new Error();
      process.env.CONFIG_PATH = mockConfigPath;
      mockWriteFileSync.mockImplementationOnce(() => { throw mockError; });
      jest.spyOn(LocalConsoleClient, 'getLocalConsole').mockResolvedValueOnce(mockConsole);
      jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());

      let thrownError;
      try {
        await LocalConsoleClient.deleteLocalConsole('mock-console');
      } catch (error) {
        thrownError = error;
      } finally {
        expect(LocalConsoleClient.getLocalConsole).toBeCalled();
        expect(mockWriteFileSync).toBeCalled();
        expect(global.console.error).toBeCalled();
        expect(global.console.error).toBeCalledWith('Failed to delete local console mock-console!', mockError);
        expect(thrownError).toBeDefined();
        expect(thrownError).toEqual(mockError);
      }
    });
  });
});