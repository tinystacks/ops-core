const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockGetPages = jest.fn();
const mockPostPage = jest.fn();

jest.mock('../../../../src/controllers/page-controller', () => ({
  getPages: mockGetPages,
  postPage: mockPostPage
}));

jest.mock('express');

import PageRoutes from '../../../../src/routes/consoles/{consoleName}/pages';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  route: '/mock'
};
const mockRequestParams = {
  consoleName: 'mock-console'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/pages tests', () => {
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
  describe('GET', () => {
    it('returns 200 if successful', async () => {
      mockRequest.params = mockRequestParams;
      mockGetPages.mockResolvedValue([mockRequestBody]);

      await PageRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetPages).toBeCalled();
      expect(mockGetPages).toBeCalledWith(mockRequestParams.consoleName);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith([mockRequestBody]);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockGetPages.mockImplementationOnce(() => { throw mockError; });

      await PageRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetPages).toBeCalled();
      expect(mockGetPages).toBeCalledWith(mockRequestParams.consoleName);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('POST', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPostPage.mockResolvedValue(mockRequestBody);

      await PageRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostPage).toBeCalled();
      expect(mockPostPage).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPostPage.mockImplementationOnce(() => { throw mockError; });

      await PageRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostPage).toBeCalled();
      expect(mockPostPage).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});