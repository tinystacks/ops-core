const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockSend = jest.fn();
const mockGetWidget = jest.fn();
const mockPutWidget = jest.fn();
const mockDeleteWidget = jest.fn();

jest.mock('../../../../../src/controllers/widget-controller.ts', () => ({
  getWidget: mockGetWidget,
  putWidget: mockPutWidget,
  deleteWidget: mockDeleteWidget
}));

jest.mock('express');

import WidgetRoutes from '../../../../../src/routes/consoles/{consoleName}/widgets/{widgetId}';
import { Request, Response } from 'express';

let mockRequest = {} as Request;
const mockRequestBody = {
  id: 'mock-widget'
};
const mockRequestParams = {
  consoleName: 'mock-console',
  widgetId: 'mock-widget'
};
const mockResponse = {
  status: mockStatus,
  send: mockSend
} as unknown as Response;

describe('/widgets/{widgetId} tests', () => {
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
      mockGetWidget.mockResolvedValue([mockRequestBody]);

      await WidgetRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetWidget).toBeCalled();
      expect(mockGetWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith([mockRequestBody]);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockGetWidget.mockImplementationOnce(() => { throw mockError; });

      await WidgetRoutes().GET(mockRequest, mockResponse, mockNext);

      expect(mockGetWidget).toBeCalled();
      expect(mockGetWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('PUT', () => {
    it('returns 200 if successful', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      mockPutWidget.mockResolvedValue(mockRequestBody);

      await WidgetRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutWidget).toBeCalled();
      expect(mockPutWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId, mockRequestBody);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.body = mockRequestBody;
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockPutWidget.mockImplementationOnce(() => { throw mockError; });

      await WidgetRoutes().PUT(mockRequest, mockResponse, mockNext);

      expect(mockPutWidget).toBeCalled();
      expect(mockPutWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId, mockRequestBody);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
  describe('DELETE', () => {
    it('returns 200 if successful', async () => {
      mockRequest.params = mockRequestParams;
      mockDeleteWidget.mockResolvedValue(mockRequestBody);

      await WidgetRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteWidget).toBeCalled();
      expect(mockDeleteWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId);
      expect(mockStatus).toBeCalled();
      expect(mockStatus).toBeCalledWith(200);
      expect(mockSend).toBeCalled();
      expect(mockSend).toBeCalledWith(mockRequestBody);
    });
    it('calls next function with error if an error is thrown', async () => {
      mockRequest.params = mockRequestParams;
      const mockError = new Error('Error!');
      mockDeleteWidget.mockImplementationOnce(() => { throw mockError; });

      await WidgetRoutes().DELETE(mockRequest, mockResponse, mockNext);

      expect(mockDeleteWidget).toBeCalled();
      expect(mockDeleteWidget).toBeCalledWith(mockRequestParams.consoleName, mockRequestParams.widgetId);
      expect(mockStatus).not.toBeCalled();
      expect(mockSend).not.toBeCalled();
      expect(mockNext).toBeCalled();
      expect(mockNext).toBeCalledWith(mockError);
    });
  });
});