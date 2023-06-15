import { TinyStacksError as TinyStacksErrorType } from '@tinystacks/ops-model';
import { ReasonPhrases, StatusCodes, getReasonPhrase } from 'http-status-codes';

type ShortTinyStacksError = {
  status: number;
  message: string;
}

function getErrorType (status: number) {
  const fallbackMap: {
    [key: string]: string
  } = {
    '4': ReasonPhrases.BAD_REQUEST,
    '5': ReasonPhrases.INTERNAL_SERVER_ERROR
  };
  try {
    return getReasonPhrase(status);
  } catch {
    const errorCategory = status.toString().at(0);
    return fallbackMap[errorCategory] || ReasonPhrases.INTERNAL_SERVER_ERROR;
  }
}

class TinyStacksError implements TinyStacksErrorType {
  static TinyStacksErrorName = 'TinyStacksError';
  name: string;
  type: string;
  message: string;
  status: number;
  stack?: string;
  cause?: string;
  fields?: {
    [key: string]: string
  };
  context?: string;

  constructor (
    message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: number = StatusCodes.INTERNAL_SERVER_ERROR,
    stack?: string,
    type?: string,
    cause?: string,
    fields?: {
      [key: string]: string
    },
    context?: string
  ) {
    this.name = TinyStacksError.TinyStacksErrorName;
    this.message = message;
    this.status = status;
    this.stack = stack;
    this.type = type;
    this.cause = cause;
    this.fields = fields;
    this.context = context;
  }

  static fromJson (errorObject: TinyStacksErrorType | ShortTinyStacksError): TinyStacksError {
    const {
      message,
      status = StatusCodes.INTERNAL_SERVER_ERROR
    } = errorObject as TinyStacksErrorType | ShortTinyStacksError;
    const {
      cause,
      stack,
      type = getErrorType(status),
      fields,
      context
    } = errorObject as TinyStacksErrorType;
    return new TinyStacksError(
      message,
      status,
      stack,
      type,
      cause,
      fields,
      context
    );
  }

  toJson (): TinyStacksErrorType {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      stack: this.stack,
      type: this.type,
      cause: this.cause,
      fields: this.fields,
      context: this.context
    };
  }

  static isTinyStacksError (error: unknown): boolean {
    const e = error as any;
    const hasTinyStacksErrorName: boolean = (e?.name && e?.name === TinyStacksError.TinyStacksErrorName) || false;
    const hasTinyStacksErrorType: boolean = (e?.type && typeof e?.type === 'string') || false;
    const hasMessage: boolean = (e?.message && typeof e?.message === 'string') || false;
    const hasStatus: boolean = (e?.status && typeof e?.status === 'number') || false;
    const isTsError: boolean = (
      hasTinyStacksErrorName &&
      hasTinyStacksErrorType &&
      hasMessage &&
      hasStatus
    );
    return isTsError;
  }
}

export {
  TinyStacksError,
  ShortTinyStacksError
};
export default TinyStacksError;