const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockGetPing = jest.fn();

jest.mock('../../src/controllers/ping-controller.ts', () => ({
  getPing: mockGetPing
}));

jest.mock('express');

import PingRoutes from '../../src/routes/ping';
import { Request, Response } from 'express';

const mockRequest = {} as Request;
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/ping tests', () => {
  beforeEach(() => {
    mockStatus.mockReturnValue(mockResponse);
    mockSend.mockReturnValue(mockResponse);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('GET', () => {
    it('returns 200 if successful', async () => {
      mockGetPing.mockResolvedValue('pong');

      await PingRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith('pong');
    });
    it('calls next function with error if an error is thrown', async () => {
      const mockError = new Error('Error!');
      mockGetPing.mockImplementationOnce(() => { throw mockError; });

      await PingRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});