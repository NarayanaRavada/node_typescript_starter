export const enum STATUS_CODES {
  _ok = 200,
  _bad_request = 400,
  _unauthorized = 403,
  _not_found = 404,
  _internal_error = 500,
}

export class AppError extends Error {
  statusCode: STATUS_CODES;
  isFunctional: boolean;
  errorStack?: any;
  logError?: boolean;

  constructor(
    name: string,
    statusCode: STATUS_CODES,
    description: string,
    isFunctional: boolean,
    logErrorResponse?: boolean,
    errorStack?: any
  ) {
    super(description);
    this.name = name;
    this.statusCode = statusCode;
    this.isFunctional = isFunctional;
    this.errorStack = errorStack;
    this.logError = logErrorResponse;
    Error.captureStackTrace(this);
  }
};

/* Api Errors */
export class ApiError extends AppError {
  constructor(
    name: string,
    statusCode = STATUS_CODES._internal_error,
    description = 'Internal Server Error',
    isFunctional = true,
    logError = true,
  ) {
    super(name, statusCode, description, isFunctional, logError);
  }
};

export class NotFoundErr extends AppError {
  constructor(
    description = 'Route Not Found',
    isFunctional = true,
  ) {
    super('Not Found', STATUS_CODES._not_found, description, isFunctional, false);
  }
}

export class BadReqError extends AppError {
  constructor(
    description = 'Bad Request',
    logErrorResponse = false,
  ) {
    super('Not Found', STATUS_CODES._bad_request, description, true, logErrorResponse);
  }
};

export class ValidationError extends AppError {
  constructor(
    description = 'Validation Error',
    errorStack: any
  ) {
    super(
      'Bad Requesst',
      STATUS_CODES._bad_request,
      description,
      true,
      false,
      errorStack
    );
  }
};
