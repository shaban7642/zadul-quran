/* eslint-disable new-cap */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import { injectable, inject } from 'inversify';
import { get } from 'lodash';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import UserModel from '../db/models/users.model';
import RoleModel from '../db/models/roles.model';

import { UserService } from './index';

import ServerConfig from '../configs/server.config';
import { SERVICE_IDENTIFIER } from '../constants';
import HttpException from '../exceptions/HttpException';

import logger from '../utils/logger';
import { isEmptyObject } from '../utils/util';

import { Credentials, TokenData } from '../types/auth.type';

// const twilio = require('twilio');

const passwordValidation = (password: string) => {
  if (
    password.match(/[a-z]/g) &&
    password.match(/[A-Z]/g) &&
    password.match(/[0-9]/g) &&
    password.match(/[^a-zA-Z\d]/g) &&
    password.length >= 8
  ) {
    return true;
  }
  return false;
};

@injectable()
class AuthService {
  public userModel = UserModel;

  public userService: UserService;

  constructor(
    @inject(SERVICE_IDENTIFIER.USER_SERVICE)
    userService: UserService
  ) {
    this.userService = userService;
  }

  public async authorize(
    credentials: Credentials
  ): Promise<{
    cookie: string;
    user: { [key: string]: any };
    tenant?: number;
  }> {
    // control level do validation
    if (isEmptyObject(credentials))
      throw new HttpException(400, 30012, 'Credentials cannot be empty');

    const { email, password } = credentials;

    const user: any = await this.userService.findOne({
      where: { email },
      include: [{ model: RoleModel }],
    });
    if (!user) {
      throw new HttpException(409, 30001, `Email address ${email} not found.`);
    }

    const isPasswordMatching: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatching) {
      throw new HttpException(409, 30001, 'Invalid credentials.');
    }

    delete user.password;

    const tokenData = AuthService.createJwtToken({
      userId: user.id,
    });

    const cookie = AuthService.createCookie(tokenData);

    this.userService.update(
      { where: { id: user.id } },
      { lastLoginDate: new Date() }
    );
    return {
      cookie,
      user,
    };
  }

  public async reAuthorize(
    userId: number,
    q: any
  ): Promise<{ [key: string]: any }> {
    if (!userId && !q) {
      throw new HttpException(403, 10002, 'Authentication failed');
    }

    // without token
    if (userId && q === undefined) {
      const user: any = await this.userModel.findOne({
        where: { id: userId },
        attributes: {
          exclude: ['lastLoginDate', 'password'],
        },
        include: [{ model: RoleModel }],
      });
      if (!user) {
        throw new HttpException(403, 10002, 'Authentication failed');
      }

      const userData = user.toJSON();

      return { userData };
    }

    // with token
    try {
      jwt.verify(q, process.env.JWT_SECRET as string);
    } catch {
      throw new HttpException(403, 10002, 'Unable to verify token');
    }

    const decode: any = jwt.decode(q);
    const tokenUserId = get(decode, 'userId', null);

    const user: any = await this.userModel.findOne({
      where: { id: tokenUserId || userId },
      attributes: {
        exclude: ['lastLoginDate', 'password'],
      },
      include: [{ model: RoleModel }],
    });

    if (!user) {
      throw new HttpException(
        403,
        10002,
        'Authentication failed createJwtToken User not found'
      );
    }

    const userData = user.toJSON();

    const tokenData = AuthService.createJwtToken({
      userId: user.id,
    });
    const cookie = AuthService.createCookie(tokenData);
    await this.userService.update(
      { where: { id: user.id } },
      { lastLoginDate: new Date() }
    );

    return {
      cookie,
      userData,
    };
  }

  public async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ success: boolean }> {
    const user: UserModel = (await this.userModel.findOne({
      where: { id },
      include: [{ model: RoleModel }],
    })) as UserModel;
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new HttpException(400, 10002, 'Incorrect password');
    }
    if (newPassword !== confirmNewPassword) {
      throw new HttpException(400, 30012, 'New passwords do not match');
    }
    if (!passwordValidation(newPassword)) {
      throw new HttpException(
        400,
        30013,
        'Password must be at least 8 characters long, contains an uppercase and lowercase character, a number and a symbol. '
      );
    }
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.userService.update(
        { where: { id } },
        {
          ...user,
          password: hashedNewPassword,
        }
      );
      return { success: true };
    } catch (err) {
      logger.log({
        level: 'error',
        label: 'Auth Service',
        message: err.stack,
      });
      throw new HttpException(400, 30000, err.message);
    }
  }

  public static createJwtToken(
    dataStoredInToken: any,
    // Set session expiration to x days.
    expiresIn = 60 * 60 * 24 * 365 * 100
  ): TokenData {
    const secret: string | undefined = process.env.JWT_SECRET;
    // const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret as string, { expiresIn }),
    };
  }

  public static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; SameSite=None; Secure; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn} Domain=${process.env.MAIN_DOMAIN};`;
    // return `Authorization=${tokenData.token}; Path=/; Max-Age=${tokenData.expiresIn}; Domain=${process.env.MAIN_DOMAIN}`;
    // return `Authorization=${tokenData.token}; HttpOnly; Path=/; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthService;
