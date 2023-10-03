/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions } from 'sequelize';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';

import { SessionsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import Patches from '../db/models/patches.model';
import Departments from '../db/models/departments.model';
import ZoomSessionMeetings from '../db/models/zoomSessionMettings.model';

const attributes = [
  'id',
  'title',
  'patchId',
  'sessionMethod',
  'meetingId',
  'date',
  'startTime',
  'endTime',
  'status',
  'createdAt',
  'updatedAt',
];

@injectable()
class SessionsController {
  public userModel = UserModel;

  public zoomSessionMeetings = ZoomSessionMeetings;

  public sessionsService: SessionsService;

  constructor(
    sessionsService = iocContainer.get<SessionsService>(
      SERVICE_IDENTIFIER.SESSIONS_SERVICE
    )
  ) {
    this.sessionsService = sessionsService;
  }

  public getAllSessions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { offset, limit, sortDir, sortBy } = req.query;

      const query: FindOptions = {
        attributes,
        include: [
          {
            model: Patches,
            include: [
              { model: UserModel, as: 'student' },
              { model: UserModel, as: 'teacher' },
              { model: Departments },
            ],
          },
          { model: ZoomSessionMeetings },
        ],
        ...getPagination(limit, offset),
        ...getOrderOptions([
          { sortKey: sortBy || 'createdAt', sortOrder: sortDir || 'asc' },
        ]),
      };

      const resp = await this.sessionsService.findAndCountAll(query);
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public createSessions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
        dayOfWeek,
        startTime,
        endTime,
        title,
        sessionMethod,
      } = req.body;

      const resp = await this.sessionsService.createMany({
        studentId,
        teacherId,
        departmentId,
        fromDate,
        toDate,
        dayOfWeek,
        startTime,
        endTime,
        title,
        sessionMethod,
      });
      return res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public updateSession = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const { id: sessionId } = req.params;
      const resp = await this.sessionsService.update(
        { where: { id: Number(sessionId) } },
        data
      );
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public deleteSession = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: sessionId } = req.params;
      const resp = await this.sessionsService.deleteSession({
        where: { id: Number(sessionId) },
      });
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };

  public generateMeeting = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req;
      const { code, sessionId } = req.query;

      // Exchange the code for an access token
      const response = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          code,
          grant_type: 'authorization_code',
          redirect_uri: `http://localhost:3000/sessions/?sessionId=${sessionId}`,
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID,
          password: process.env.ZOOM_SECRET_KEY,
        },
      });

      const accessToken = response.data.access_token;

      const meetingResp = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: 'Meeting Topic',
          type: 2, // Scheduled Meeting
          // start_time: '2023-10-01T12:00:00Z', // Replace with your desired start time
          duration: 60, // Meeting duration in minutes
          settings: {
            host_video: true,
            participant_video: true,
            mute_upon_entry: false,
            join_before_host: true,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (meetingResp.status === 201) {
        await this.zoomSessionMeetings.create({
          sessionId,
          userId,
          duration: 60,
          meetingLink: meetingResp.data.join_url,
        });
        await this.sessionsService.update(
          { where: { id: sessionId } },
          {
            status: 'running',
          }
        );
      }

      // Now you have the access token, you can use it to create a meeting
      // See step 4 for creating a meeting

      console.log('Meeting created successfully');
      console.log('Join URL:', meetingResp.data.join_url);
      res
        .status(200)
        .json({ success: true, meetingUrl: meetingResp.data.join_url });
    } catch (error) {
      console.log(error?.response?.data);
      next(error);
    }
  };
}

export default SessionsController;
