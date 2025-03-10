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

      const sortType = searchValues?.status === 'waiting' ? 'asc' : 'desc';
      const updatedAttributes =
        searchValues?.status === 'rescheduled'
          ? attributes.concat(['history'])
          : attributes;

      const query: FindOptions = {
        attributes: updatedAttributes,
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
          ['date', sortType],
          ['startTime', sortType],
        ], // Static Order By Date and startTime
        ...getPagination(limit, offset),
        // ...getOrderOptions([
        //   { sortKey: sortBy || 'date', sortOrder: sortDir || 'desc' },
        // ])
      };

      const { count, rows } = await this.sessionsService.findAndCountAll(query);

      const promises = rows.map(async (session: Session) => {
        // Split the time into hours, minutes, and seconds
        if (!session.startTime) {
          console.log(session.id);
          console.log(session);
          return session;
        }
        const [hours, minutes, seconds] = session.startTime
          .toString()
          .split(':')
          .map(Number);

        // Create a moment object for the session start time
        const sessionStartTime = moment(session.date)
          .set({
            hour: hours,
            minute: minutes,
            second: seconds,
          })
          .tz('UTC');

        // Get current time in UTC
        const currentTime = moment.tz('UTC');

        // Check if half duration has passed since start time
        const halfDurationPassed = moment(sessionStartTime)
          .add(session?.sessionType?.duration / 2, 'minutes')
          .tz('UTC')
          .isBefore(currentTime);

        // Calculate the difference in minutes
        const minutesUntilStart = sessionStartTime.diff(currentTime, 'minutes');

        // Check if we're within 5 minutes of start time
        const isNearStartTime = minutesUntilStart <= 5;

        if (
          session?.sessionType &&
          session?.status === 'waiting' &&
          isNearStartTime
        ) {
          await this.sessionsService.update(
            { where: { id: session.id } },
            { status: 'running' }
          );
          return { ...session, status: 'running' };
        }

        // Mark as expired or absent if half duration has passed and session is still running
        if (
          session?.sessionType &&
          halfDurationPassed &&
          session?.status === 'running' &&
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
          halfDurationPassed &&
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

  public getSessionByStudentId = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { studentId } = req.params;
      const { forRenew = false } = req.query;

      if (!studentId) {
        return res.status(400).json({ message: 'studentId is required' });
      }

      const query: FindOptions = {
        where: {},
        include: [
          {
            model: Patches,
            include: [
              {
                model: UserModel,
                as: 'student',
                where: { id: studentId },
                required: true,
                attributes: { exclude: ['password'] },
              },
            ],
            required: true,
          },
          { model: SessionTypesModel },
        ],
        order: [['createdAt', 'DESC']],
        limit: forRenew ? 100 : 1,
      };

      let sessions = [] as any[];
      if (forRenew) {
        sessions = await this.sessionsService.findAll({
          attributes,
          include: [
            {
              model: Patches,
              include: [
                {
                  model: UserModel,
                  as: 'student',
                  ...(studentId && {
                    where: { id: studentId },
                    required: true,
                  }),
                },
                {
                  model: UserModel,
                  as: 'teacher',
                },
                {
                  model: Departments,
                },
              ],
              required: true,
            },
          ],
          order: [
            ['createdAt', 'desc'],
            // ['startTime', 'desc'],
          ],
          ...getPagination(40, 0),
        });
      } else {
        sessions = (await this.sessionsService.findOne(query)) as any[];
      }

      if (!sessions || (Array.isArray(sessions) && sessions.length === 0)) {
        return res.status(404).json({ message: 'Session not found' });
      }

      if (forRenew) {
        const groupedByBatch = new Map();

        // Group sessions by batchId
        for (const session of sessions) {
          if (!groupedByBatch.has(session.batchId)) {
            groupedByBatch.set(session.batchId, []);
          }
          groupedByBatch.get(session.batchId).push(session);
        }

        const uniquePatches = new Map();
        const selectedSessions = [];

        for (const batchSessions of groupedByBatch.values()) {
          for (const session of batchSessions) {
            if (!uniquePatches.has(session.patchId)) {
              uniquePatches.set(session.patchId, true);

              // Get all other sessions with the same patchId as children
              const childrenData = batchSessions.filter(
                (s: any) => s.patchId === session.patchId && s !== session
              );

              const children = [
                {
                  id: session.id,
                  title: session.title,
                  date: session.date,
                  startTime: session.startTime,
                  endTime: session.endTime,
                  status: session.status,
                },
                ...childrenData.map((child: any) => ({
                  id: child.id,
                  title: child.title,
                  date: child.date,
                  startTime: child.startTime,
                  endTime: child.endTime,
                  status: child.status,
                })),
              ].sort((a, b) => a.id - b.id);

              selectedSessions.push({
                ...session,
                children,
              });
            }
            if (uniquePatches.size === 2) break; // Stop when we have 2 unique patches
          }
          if (uniquePatches.size === 2) break;
        }

        return res.status(200).json({ sessions: selectedSessions });
      }

      return res.status(200).json({ session: sessions });
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
        schedule,
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
        schedule,
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
      const { id: sessionId } = req.params;
      const data = req.body;

      if (!sessionId) {
        return res
          .status(400)
          .json({ success: false, message: 'Session ID is required' });
      }

      const updateData = { ...data };

      if (data.status === 'rescheduled') {
        const session = await this.sessionsService.findOne({
          where: { id: Number(sessionId) },
        });

        if (!session) {
          return res
            .status(404)
            .json({ success: false, message: 'Session not found' });
        }

        updateData.history = {
          title: session?.title || '',
          date: session?.date || '',
          startTime: session?.startTime || '',
          endTime: session?.endTime || '',
          status: session?.status || '',
        };
      }

      const resp = await this.sessionsService.update(
        { where: { id: Number(sessionId) } },
        updateData
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

  public createSessionTypes = async (
    req: RequestWithIdentity,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, duration } = req.body;
      await this.sessionTypesModel.create({
        name,
        duration,
      });
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

export default SessionsController;
