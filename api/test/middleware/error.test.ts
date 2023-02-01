const mockNext = jest.fn();
const mockStatus = jest.fn();
const mockJson = jest.fn();

jest.mock('express');

import { TinyStacksError as TinyStacksErrorType } from '@tinystacks/ops-model';
import TinyStacksError from '../../src/errors/tinystacks-error';
import { errorMiddleware } from '../../src/middleware';
import { Request, Response } from 'express';
import HttpError from 'http-errors';

let mockRequest = {} as Request;
const mockResponse = {
  status: mockStatus,
  json: mockJson
} as unknown as Response;

describe('error middleware tests', () => {
  beforeEach(() => {
    mockRequest = {} as Request;
    mockStatus.mockReturnValue(mockResponse);
    mockJson.mockReturnValue(mockResponse);
    jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
  });
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  it('logs error and responds with status and message if the error is an HttpError', async () => {
    const mockError = HttpError.ImATeapot('mock-error');

    await errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(mockError);
    expect(mockStatus).toBeCalled();
    expect(mockStatus).toBeCalledWith(418);
    expect(mockJson).toBeCalled();
    expect(mockJson).toBeCalledWith({ status: 418, message: 'mock-error' });
    expect(mockNext).toBeCalled();
  });
  
  it('logs error and responds with status and message if the error is a TinyStacksError', async () => {
    const mockError: TinyStacksErrorType = TinyStacksError.fromObject({
      name: 'TinyStacksError',
      status: 418,
      message: 'mock-error',
      type: 'Validation'
    });

    await errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(mockError);
    expect(mockStatus).toBeCalled();
    expect(mockStatus).toBeCalledWith(418);
    expect(mockJson).toBeCalled();
    expect(mockJson).toBeCalledWith({ status: 418, message: 'mock-error' });
    expect(mockNext).toBeCalled();
  });
  
  it('logs error and responds with status and message if the error matches shape of TinyStacksError', async () => {
    const mockError = {
      name: 'TinyStacksError',
      status: 418,
      message: 'mock-error',
      type: 'Validation'
    };

    await errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(mockError);
    expect(mockStatus).toBeCalled();
    expect(mockStatus).toBeCalledWith(418);
    expect(mockJson).toBeCalled();
    expect(mockJson).toBeCalledWith({ status: 418, message: 'mock-error' });
    expect(mockNext).toBeCalled();
  });
  
  it('logs error and responds with InternalServerError if the error is a not a TinyStacksError or an HttpError', async () => {
    const mockError = new Error('Error!');

    await errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(mockError);
    expect(mockStatus).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalled();
    expect(mockJson).toBeCalledWith(HttpError.InternalServerError('An unexpected error occured!'));
    expect(mockNext).toBeCalled();
  });
  
  it('logs error and responds with InternalServerError if the error is a not a TinyStacksError or an HttpError even if similar shape', async () => {
    const mockError = {
      message: 'Error!',
      status: 400
    };

    await errorMiddleware(mockError, mockRequest, mockResponse, mockNext);

    expect(console.error).toBeCalled();
    expect(console.error).toBeCalledWith(mockError);
    expect(mockStatus).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalled();
    expect(mockJson).toBeCalledWith(HttpError.InternalServerError('An unexpected error occured!'));
    expect(mockNext).toBeCalled();
  });
})