/* eslint-disable no-continue */
/* eslint-disable consistent-return */
import { injectable } from 'inversify';
import { NextFunction, Response } from 'express';
import { FindOptions, Op, Sequelize, WhereOptions } from 'sequelize';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import momentTz from 'moment-timezone';
import jwt from 'jsonwebtoken';

import { SERVICE_IDENTIFIER } from '../constants';
import iocContainer from '../configs/ioc.config';
import UserModel from '../db/models/users.model';
import SessionsModel from '../db/models/sessions.model';

import { DepartmentsService, SessionsService } from '../services';
import { RequestWithIdentity } from '../types/auth.type';
import { getPagination, getOrderOptions } from '../utils/sequelize';
import Patches from '../db/models/patches.model';
import Departments from '../db/models/departments.model';
import SessionTypesModel from '../db/models/sessionTypes.model';
import ZoomSessionMeetings from '../db/models/zoomSessionMettings.model';
import { Session } from '../types/sessions.type';
import ReportsModel from '../db/models/reports.model';
import DocumentsModel from '../db/models/documents.model';

const attributes = [
  'id',
  'title',
  'patchId',
  'sessionMethod',
  'meetingId',
  'sessionTypeId',
  'date',
  'startTime',
  'endTime',
  'status',
  'startedAt',
  'joinedAt',
  'endedAt',
  'createdAt',
  'updatedAt',
];

@injectable()
class SessionsController {
  public userModel = UserModel;

  public sessionTypesModel = SessionTypesModel;

  public sessionsModel = SessionsModel;

  public zoomSessionMeetings = ZoomSessionMeetings;

  public sessionsService: SessionsService;

  constructor(
    sessionsService = iocContainer.get<SessionsService>(
      SERVICE_IDENTIFIER.SESSIONS_SERVICE
    ),
    public departmentsService = iocContainer.get<DepartmentsService>(
      SERVICE_IDENTIFIER.DEPARTMENTS_SERVICE
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
      const { role, userId } = req;
      const {
        offset,
        limit,
        sortDir,
        sortBy,
        teacherId,
        studentId,
        departmentId,
        ...searchValues
      } = req.query;
      const roleName = role.name || null;

      const searchParams: WhereOptions = {};

      for (const [searchByKey, searchByValue] of Object.entries(searchValues)) {
        switch (searchByKey) {
          case 'status':
            searchParams.status = {
              [Op.in]: String(searchByValue).split(','),
            };
            break;
          case 'date':
            // eslint-disable-next-line no-case-declarations
            const uploadFrom = moment(
              String(searchValues.date).split('to')[0]
            ).toDate();

            // eslint-disable-next-line no-case-declarations
            const uploadTo = moment(String(searchValues.date).split('to')[1])
              .add(1, 'day')
              .toDate();

            searchParams.date = {
              [Op.between]: [uploadFrom, uploadTo],
            };

            break;
          default:
        }
      }

      const query: FindOptions = {
        attributes,
        where: { ...searchParams },
        include: [
          {
            model: Patches,
            include: [
              {
                model: UserModel,
                as: 'student',
                ...(studentId && { where: { id: studentId }, required: true }),
                ...(roleName === 'student' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: UserModel,
                as: 'teacher',
                ...(teacherId && { where: { id: teacherId }, required: true }),
                ...(roleName === 'teacher' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: Departments,
                ...(departmentId && {
                  where: { id: departmentId },
                  required: true,
                }),
              },
            ],
            required: true,
          },
          { model: ZoomSessionMeetings },
          { model: SessionTypesModel },
          {
            model: ReportsModel,
            include: [
              { model: DocumentsModel, as: 'document' },
              { model: DocumentsModel, as: 'book' },
            ],
          },
        ],
        order: [
          ['date', 'asc'],
          ['startTime', 'asc'],
        ], // Static Order By Date and startTime
        ...getPagination(limit, offset),
        // ...getOrderOptions([
        //   { sortKey: sortBy || 'date', sortOrder: sortDir || 'desc' },
        // ])
      };

      const { count, rows } = await this.sessionsService.findAndCountAll(query);

      const promises = rows.map(async (session: Session) => {
        // Split the time into hours, minutes, and seconds
        const [hours, minutes, seconds] = session.startTime
          .toString()
          .split(':')
          .map(Number);

        // Create a moment object from session.date
        const date = moment(session.date);

        // Add the time to the date
        date.set({ hour: hours, minute: minutes, second: seconds });

        const isLessThanHalfDurationAgo = moment(date)
          .add(session?.sessionType?.duration / 2, 'minutes')
          .tz('UTC')
          .isBefore(moment.tz('UTC'));

        if (
          session?.sessionType &&
          isLessThanHalfDurationAgo &&
          session?.status === 'waiting' &&
          session?.startedAt === null
        ) {
          await this.sessionsService.update(
            { where: { id: session.id } },
            { status: 'expired' }
          );
          return { ...session, status: 'expired' };
        }
        if (
          session?.sessionType &&
          isLessThanHalfDurationAgo &&
          session?.status === 'running' &&
          session?.joinedAt === null
        ) {
          await this.sessionsService.update(
            { where: { id: session.id } },
            { status: 'absent' }
          );
          return { ...session, status: 'absent' };
        }
        return session;
      });

      const processed = await Promise.all(promises);

      // count by types
      const countTypesAttributes: any = [
        'sessions.sessionTypeId',
        [
          Sequelize.fn('COUNT', Sequelize.col('sessions.sessionTypeId')),
          'count',
        ],
      ];

      const groupTypes = ['sessions.sessionTypeId'];

      const typesCount = await this.sessionsModel.count({
        where: { ...searchParams },
        include: [
          {
            model: Patches,
            include: [
              {
                model: UserModel,
                as: 'student',
                ...(studentId && { where: { id: studentId }, required: true }),
                ...(roleName === 'student' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: UserModel,
                as: 'teacher',
                ...(teacherId && { where: { id: teacherId }, required: true }),
                ...(roleName === 'teacher' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: Departments,
                ...(departmentId && {
                  where: { id: departmentId },
                  required: true,
                }),
              },
            ],
            required: true,
          },
        ],
        attributes: countTypesAttributes,
        group: groupTypes,
      });

      // count by status
      const countAttributes: any = [
        'sessions.status',
        [Sequelize.fn('COUNT', Sequelize.col('sessions.status')), 'count'],
      ];

      const group = ['sessions.status'];

      delete searchParams.status;

      const statusCount = await this.sessionsModel.count({
        where: { ...searchParams },
        include: [
          {
            model: Patches,
            include: [
              {
                model: UserModel,
                as: 'student',
                ...(studentId && { where: { id: studentId }, required: true }),
                ...(roleName === 'student' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: UserModel,
                as: 'teacher',
                ...(teacherId && { where: { id: teacherId }, required: true }),
                ...(roleName === 'teacher' && {
                  where: { id: userId },
                  required: true,
                }),
              },
              {
                model: Departments,
                ...(departmentId && {
                  where: { id: departmentId },
                  required: true,
                }),
              },
            ],
            required: true,
          },
        ],
        attributes: countAttributes,
        group,
      });

      let totalCount = 0;
      const resp = {
        count,
        rows: processed,
        statusCount: statusCount.reduce((results: any, row: any): any => {
          results.push({
            status: row.status,
            count: row.count,
          });

          totalCount += row.count;
          return results;
        }, []),
        totalCount,
        typesCount,
      };
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
        sessionTypeId,
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
        sessionTypeId,
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

  public deleteSessions = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { ids: sessionIds } = req.body;
      // const resp = await this.sessionsService.deleteSession({
      //   where: { id: Number(sessionIds) },
      // });
      if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid session IDs' });
      }

      // Call deleteSession method, using Op.in to handle array of IDs
      const resp = await this.sessionsService.deleteSession({
        where: { id: { [Op.in]: sessionIds } }, // Use Sequelize Op.in operator for array
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

      const alreadyOneIsRunning = await this.sessionsService.findOne({
        where: { status: 'running' },
        include: [
          { model: Patches, where: { teacherId: userId }, required: true },
        ],
      });

      if (alreadyOneIsRunning) {
        throw new Error('there is already one session running!');
      }

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
            startedAt: new Date(Date.now()),
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

  public getSessionTypes = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resp = await this.sessionTypesModel.findAll();
      res.status(200).json({ success: true, resp });
    } catch (error) {
      next(error);
    }
  };
}

export default SessionsController;
