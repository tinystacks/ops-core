const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockPostWidget = jest.fn();

jest.mock('../../../../src/controllers/widget-controller', () => ({
  postWidget: mockPostWidget
}));

jest.mock('express');

import WidgetRoutes from '../../../../src/routes/consoles/{consoleName}/widgets';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  id: 'mock-widget'
};
const mockRequestParams = {
  consoleName: 'mock-console'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/widgets tests', () => {
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
  describe('POST', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPostWidget.mockResolvedValue(mockRequestBody);

      await WidgetRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostWidget).toBeCalled();
      expect(mockPostWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPostWidget.mockImplementationOnce(() => { throw mockError; });

      await WidgetRoutes().POST(mockRequest, mockResponse, mockNext);

      expect(mockPostWidget).toBeCalled();
      expect(mockPostWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});