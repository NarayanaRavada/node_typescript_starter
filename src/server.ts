import { PORT } from "./config";

import express, { Application, Request, Response } from "express";
import cors from 'cors';

import authRouter from './routes/authRouter';
import { ErrorHandler } from "./utils/error_handlers";
import { ApiError, AppError, BadReqError, NotFoundErr, STATUS_CODES } from "./utils/apiErrors";


class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.set('port', PORT || 3000);

    /* middlewares */
    this.app.use(express.json({ 'limit': '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use('/auth', authRouter);
    this.app.use('/bad', (req: Request, res: Response) => {
      throw new ApiError('error', STATUS_CODES._internal_error, 'errrorr!!', false);
    })
    this.app.use('*', (req: Request, res: Response) => {
      throw new NotFoundErr(`route ${req.originalUrl} not found`);
    })
    this.app.use(ErrorHandler);
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log(`Server is running on port: ${this.app.get('port')}`);
    })
  }
}

const server: Server = new Server();
server.start();
