import { TinyStacksError as TinyStacksErrorType } from '@tinystacks/ops-model';
import { TinyStacksError } from '../src/tinystacks-error';

describe('TinyStacksError', () => {
  describe('fromJson', () => {
    it('returns a TinyStacksError instance', () => {
      const inputError = {
        message: 'error',
        status: 418,
        stack: 'Error at line 1',
        type: 'Validation'
      } as TinyStacksErrorType;

      const tsError = TinyStacksError.fromJson(inputError);

      expect(tsError).toHaveProperty('name', TinyStacksError.TinyStacksErrorName);
      expect(tsError).toHaveProperty('message', 'error');
      expect(tsError).toHaveProperty('status', 418);
      expect(tsError).toHaveProperty('stack', 'Error at line 1');
      expect(tsError).toHaveProperty('type', 'Validation');
    });
    
    it('defaults type to standard type for status if type is not specified', () => {
      const inputError = {
        message: 'error',
        status: 424,
        stack: 'Error at line 1'
      } as unknown as TinyStacksErrorType;

      const tsError = TinyStacksError.fromJson(inputError);

      expect(tsError).toHaveProperty('name', TinyStacksError.TinyStacksErrorName);
      expect(tsError).toHaveProperty('message', 'error');
      expect(tsError).toHaveProperty('status', 424);
      expect(tsError).toHaveProperty('stack', 'Error at line 1');
      expect(tsError).toHaveProperty('type', 'Failed Dependency');
    });
    it('defaults type to standard type for error category if standard type is not found for specific status code', () => {
      const inputError = {
        message: 'error',
        status: 508,
        stack: 'Error at line 1'
      } as unknown as TinyStacksErrorType;

      const tsError = TinyStacksError.fromJson(inputError);

      expect(tsError).toHaveProperty('name', TinyStacksError.TinyStacksErrorName);
      expect(tsError).toHaveProperty('message', 'error');
      expect(tsError).toHaveProperty('status', 508);
      expect(tsError).toHaveProperty('stack', 'Error at line 1');
      expect(tsError).toHaveProperty('type', 'Internal Server Error');
    });
  });

  describe('isTinyStacksError', () => {
    it('returns true for objects that have status, message, and appropriate type and name', () => {
      const errorObject = {
        name: 'TinyStacksError',
        type: 'Validation',
        status: 418,
        message: 'Error!'
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(true);
    });
    it('returns false if object does not have TinyStacksError name', () => {
      const errorObject = {
        name: 'OtherError',
        type: 'Validation',
        status: 418,
        message: 'Error!'
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(false);
    });
    it('returns false if object does not have status', () => {
      const errorObject = {
        name: 'TinyStacksError',
        type: 'Validation',
        message: 'Error!'
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(false);
    });
    it('returns false if status is not a number', () => {
      const errorObject = {
        name: 'TinyStacksError',
        type: 'Validation',
        status: '418',
        message: 'Error!'
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(false);
    });
    it('returns false if object does not have message', () => {
      const errorObject = {
        name: 'TinyStacksError',
        type: 'Validation',
        status: 418
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(false);
    });
    it('returns false if message is not a string', () => {
      const errorObject = {
        name: 'TinyStacksError',
        type: 'Validation',
        status: 418,
        message: {}
      };

      const isTsError = TinyStacksError.isTinyStacksError(errorObject);

      expect(isTsError).toBe(false);
    });
  });
});