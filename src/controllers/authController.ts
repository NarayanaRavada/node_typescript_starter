import Joi from "joi";
import prisma from "../prisma/client";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import { ValidationError } from "../utils/apiErrors";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utils/auth";

const signinSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const validation_result = signinSchema.validate(req.body);
  if (validation_result.error) {
    throw new ValidationError(
      'validation at signin',
      validation_result.error.details
    )
  }

  const data = validation_result.value as {
    username: string;
    password: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    }
  });
  if (user == null) {
    throw new ValidationError(
      'validation at signin',
      'invalid credentials'
    )
  }

  const isPasswordMatched = await ValidatePassword(data.password, user.password);

  if (!isPasswordMatched) {
    throw new ValidationError(
      'validation at signin',
      'invalid credentials'
    )
  }

  const token = await GenerateSignature({
    username: user.username
  });

  res.status(200).json({
    message: 'login successful',
    token: token
  });
});

const signupSchema = Joi.object().keys({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const validation_result = signupSchema.validate(req.body);
  if (validation_result.error) {
    throw new ValidationError(
      'validation at signup',
      validation_result.error.details
    )
  }

  const data = validation_result.value as {
    username: string;
    password: string;
    confirm_password: string;
    email: string;
  };

  if (data.password != data.confirm_password) {
    throw new ValidationError(
      'validation at signup',
      'password and confirm_password must be same'
    )
  }

  const username = await prisma.user.findUnique({
    where: {
      username: data.username,
    }
  });
  if (username != null) {
    throw new ValidationError(
      'validation at signup',
      'username already exists'
    )
  }
  const email = await prisma.user.findUnique({
    where: {
      username: data.email,
    }
  });
  if (email != null) {
    throw new ValidationError(
      'validation at signup',
      'email already exists'
    )
  }

  const hashedPasswrod = await GeneratePassword(data.password, await GenerateSalt());

  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPasswrod,
      email: data.email,
    }
  });

  res.status(200).json({
    message: 'user created successfully',
    user: user,
  });
});
