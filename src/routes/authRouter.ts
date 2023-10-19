import { Router } from "express";
import { signin, signup } from '../controllers/authController';
//import { isLoggedIn, isNotLoggedIn } from '../controllers/middlewares';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes(): void {
    this.router.post('/signup', signup);
    this.router.post('/signin', signin);
  }
}

const userRouter = new UserRouter();

export default userRouter.router;
