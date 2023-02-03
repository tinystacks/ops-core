import { TinyStacksError as TinyStacksErrorType } from '@tinystacks/ops-model';
import { TinyStacksErrorObject } from '../types';

class TinyStacksError implements TinyStacksErrorType {
  static TinyStacksErrorName = 'TinyStacksError';
  name: string;
  type: TinyStacksErrorType.type;
  message: string;
  status: number;
  stack?: string;

  constructor (
    message?: string,
    status?: number,
    stack?: string,
    type?: TinyStacksErrorType.type
  ) {
    this.name = TinyStacksError.TinyStacksErrorName;
    this.message = message;
    this.status = status;
    this.stack = stack;
    this.type = type;
  }

  static fromJson (errorObject: TinyStacksErrorObject): TinyStacksError {
    const {
      message,
      status,
      stack,
      type
    } = errorObject;
    const typeIsEnumValue = Object.values(TinyStacksErrorType.type).map(t => t.toString()).includes(type);
    let errorType = TinyStacksErrorType.type.INTERNAL_SERVER_ERROR;
    if (typeIsEnumValue) {
      errorType = type as TinyStacksErrorType.type;
    }
    return new TinyStacksError(
      message,
      status,
      stack,
      errorType
    );
  }
  
  static isTinyStacksError (error: unknown): boolean {
    const e = error as any;
    const hasTinyStacksErrorName: boolean = e?.name && e?.name === TinyStacksError.TinyStacksErrorName;
    const hasTinyStacksErrorType: boolean = e?.type && Object.values(TinyStacksErrorType.type).includes(e?.type);
    const hasMessage: boolean = e?.message && typeof e?.message === 'string';
    const hasStatus: boolean = e?.status && typeof e?.status === 'number';
    const isTsError: boolean = (
      hasTinyStacksErrorName &&
      hasTinyStacksErrorType &&
      hasMessage &&
      hasStatus
    );
    return isTsError;
  }
}

export default TinyStacksError;