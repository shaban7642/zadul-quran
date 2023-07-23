import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { injectable } from 'inversify';
import { sequelize } from '../db/models/index';
import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import HttpException from '../exceptions/HttpException';

import { AuthService, UserAgentsService, UserService } from '../services';
import logger from '../utils/logger';
import { RequestWithIdentity } from '../types/auth.type';

export interface IGetUserAuthInfoRequest extends Request {
  userId: number;
}

@injectable()
class AuthController {
  constructor(
    public authService = iocContainer.get<AuthService>(
      SERVICE_IDENTIFIER.AUTH_SERVICE
    ),
    public userService = iocContainer.get<UserService>(
      SERVICE_IDENTIFIER.USER_SERVICE
    ),
    public userAgentsService = iocContainer.get<UserAgentsService>(
      SERVICE_IDENTIFIER.USER_AGENTS_SERVICE
    )
  ) {
    this.authService = authService;
    this.userService = userService;
    this.userAgentsService = userAgentsService;
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceName = req.headers['sec-ch-ua-platform'];
      const deviceDescription = req.headers['user-agent'];
      const { user, cookie } = await this.authService.authorize(req.body);

      // Save user deviceName and deviceDescription : Start
      if (user && (deviceName || deviceDescription)) {
        const device = await this.userAgentsService.findOne({
          where: {
            userId: user.id,
            deviceName: deviceName || null,
            deviceDescription: deviceDescription || null,
          },
        });
        if (!device) {
          this.userAgentsService.createOne({
            userId: user.id,
            deviceName: deviceName ? deviceName.toString() : null,
            deviceDescription,
          });
        }
      }
      // Save user deviceName and deviceDescription : End

      res.setHeader('Set-Cookie', [cookie]);

      res.status(200).json(user);
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to sign in user: ${req.body.email}`,
      });
      next(error);
    }
  };

  public reAuthorize = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req;
    const { q } = req.query;

    try {
      const { userData, cookie } = await this.authService.reAuthorize(
        userId as number,
        q
      );

      if (cookie) {
        res.setHeader('Set-Cookie', [cookie]);
      }
      res.status(200).json({
        success: true,
        data: userData,
        message: 'reAuth',
      });
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: `Unable to re-auth user with userId: ${userId}`,
      });
      next(error);
    }
  };

  public logout = async (req: RequestWithIdentity, res: Response) => {
    res.setHeader('Set-Cookie', [
      `Authorization=; Path=/; Max-age=0; Domain=${process.env.MAIN_DOMAIN}`,
    ]);
    res.clearCookie('Authorization');
    const { userId } = req;
    const deviceName = req.headers['sec-ch-ua-platform'];
    const deviceDescription = req.headers['user-agent'];

    // remove deviceName and deviceDescription : Start
    const device = await this.userAgentsService.findOne({
      where: {
        userId,
        deviceName: deviceName || null,
        deviceDescription: deviceDescription || null,
      },
    });
    if (device) {
      this.userAgentsService.deleteUserAgent(
        userId,
        deviceName ? deviceName.toString() : null,
        deviceDescription
      );
    }
    // remove deviceName and deviceDescription : End

    res.status(200).json({
      success: true,
      message: 'Logout',
    });
  };

  public changePassword = async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    try {
      const result = await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      res.status(200).json(result);
    } catch (error) {
      logger.log({
        level: 'error',
        label: 'Auth Controller',
        message: error.message,
      });
      next(error);
    }
  };

  //   public registration = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ) => {
  //     const transaction = await sequelize.transaction();
  //     try {
  //       const { ...registrationData } = req.body;

  //       const existingUser = await this.userService.findOne({
  //         where: { email: registrationData.email },
  //       });

  //       if (existingUser)
  //         throw new HttpException(
  //           500,
  //           30003,
  //           'User already exists. Please choose a different email address.'
  //         );

  //       const resp = await this.authService.registration({
  //         data: registrationData,
  //         platformRedirect: false,
  //         transaction,
  //       });

  //       const { cookie, user, success } = resp;

  //       if (success) {
  //         transaction.commit();

  //         this.authService.sendVerificationEmail(
  //           registrationData.email,
  //           registrationData.firstName
  //         );

  //         // // check email already exist in hubspot or not
  //         // const getHubspotContact = this.hubspotService.getHubspotContact(
  //         //   registrationData.email
  //         // );
  //         // // binery lite registration
  //         // const bineryLiteSignup = this.bineryliteService.signup(
  //         //   registrationData.email,
  //         //   registrationData.password
  //         // );

  //         // const [hubSpotVid, bineryUserResponse] = await Promise.all([
  //         //   getHubspotContact,
  //         //   bineryLiteSignup,
  //         // ]);

  //         // if (hubSpotVid && bineryUserResponse) {
  //         //   await this.userService.update(
  //         //     { where: { id: user.id } },
  //         //     {
  //         //       hubSpotVid,
  //         //       bineryLiteUserId: bineryUserResponse.userId,
  //         //       bineryLiteToken: bineryUserResponse.token,
  //         //     }
  //         //   );
  //         // }

  //         res.setHeader('Set-Cookie', [cookie]);
  //         res.status(200).json({ ...user, success: true });
  //       }
  //     } catch (err) {
  //       logger.log({
  //         level: 'error',
  //         label: 'Auth Controller',
  //         message: `Unable to register user`,
  //       });
  //       next(err);
  //     }
  //   };
}

export default AuthController;
