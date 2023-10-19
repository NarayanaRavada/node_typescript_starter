import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';

import { APP_SECRET } from '../config';
import { Request } from 'express';
import { userReq } from '../custom';

declare global {
  namespace Express {
    interface Request {
      user: userReq
    }
  }
}

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const GenerateSignature = async (payload: Object | string | Buffer) => {
  try {
    return jwt.sign(payload, APP_SECRET as Secret, { expiresIn: '30d' });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignatue = (req: Request) => {
  try {
    const sign = req.get('Authorization');
    console.log(sign?.split(' ')[0]);
    if (!sign) return false;
    const payload = jwt.verify(sign.split(" ")[0], APP_SECRET as Secret);
    req.user = payload as userReq;
    console.log(payload);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
