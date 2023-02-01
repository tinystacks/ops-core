const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockPutPage = jest.fn();
const mockDeletePage = jest.fn();

jest.mock('../../../../../src/controllers/page-controller.ts', () => ({
  putPage: mockPutPage,
  deletePage: mockDeletePage
}));

jest.mock('express');

import PageRoutes from '../../../../../src/routes/consoles/{consoleName}/pages/{pageRoute}';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  name: 'mock-page'
};
const mockRequestParams = {
  consoleName: 'mock-console',
  pageRoute: '/mock'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/pages/{pageRoute} tests', () => {
  beforeEach(() => {
    mockRequest = {} as Request;
    mockStatus.mockReturnValue(mockResponse);
    mockSend.mockReturnValue(mockResponse);
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });
  describe('PUT', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPutPage.mockResolvedValue(mockRequestBody);

      await PageRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutPage).toBeCalled();
      expect(mockPutPage).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.pageRoute, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPutPage.mockImplementationOnce(() => { throw mockError; });

      await PageRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutPage).toBeCalled();
      expect(mockPutPage).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.pageRoute, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('DELETE', () => {
    it('returns 200 if successful', async () => {
      mockRequest.params = mockRequestParams;
      mockDeletePage.mockResolvedValue(mockRequestBody);

      await PageRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeletePage).toBeCalled();
      expect(mockDeletePage).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.pageRoute);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockDeletePage.mockImplementationOnce(() => { throw mockError; });

      await PageRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeletePage).toBeCalled();
      expect(mockDeletePage).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.pageRoute);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});