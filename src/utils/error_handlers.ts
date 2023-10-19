import { NextFunction, Request, Response } from "express";
import { createLogger, format, transports } from "winston";
import colors from 'colors';
import { AppError } from "./apiErrors";

const logErrors = createLogger({
  format: format.combine(
    format.label({ label: 'LOGGER' }),
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    format.printf(
      info => `[ ${info.label} ] ${info.timestamp} [ ${info.level} ] :: ${info.message}`
    ),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(
          info => `[ ${colors.cyan(info.label)} ] ${colors.dim(info.timestamp)} [ ${colors.bold(info.level)} ]` +
            `\n              `.dim.strikethrough.yellow + `  MESSAGE  `.yellow.dim + `              \n`.dim.strikethrough.yellow
            + `${info.message}` +
            `\n                                       `.dim.strikethrough.yellow
        ),
      )
    }),
    new transports.File({ filename: 'error.log' })
  ]
})

class ErrorLogger {
  constructor() { }
  async logError(err: Error) {
    logErrors.log({
      private: true,
      level: 'error',
      message: JSON.stringify(err, null, 4)
    });

    return false;
  }

  isOkError(err: any) {
    if (err instanceof AppError) {
      return err.isFunctional;
    } else {
      return false;
    }
  }
}

export const ErrorHandler = async (err: AppError, req: Request, res: Response, next: NextFunction) => {

  const errorLogger = new ErrorLogger();
  if (err) {
    if (err.logError) {
      await errorLogger.logError(err);
    }
    if (errorLogger.isOkError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ 'message': errorDescription });
      }
      return res.status(err.statusCode).json({ 'message': err.message });
    } else {
      /* aaaah gotcha */
      console.log('---> server running needs repair 🛠️ <---'.red.bold);
      return res.status(500).json(err);
    }
  }
  next();
}
