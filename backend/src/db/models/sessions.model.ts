import { Sequelize, Model, DataTypes } from 'sequelize';
import Patches from './patches.model';
import ZoomSessionMeetings from './zoomSessionMettings.model';
import Reports from './reports.model';
import SessionTypes from './sessionTypes.model';

class Sessions extends Model {
  public id!: number;

  public patchId?: number;

  public sessionTypeId?: number;

  public title?: string;

  public sessionMethod?: string;

  public meetingId?: string;

  public date?: Date;

  public startTime?: Date;

  public endTime?: Date;

  public status?: string;

  // New field for historical data
  public history?: {
    title?: string;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    status?: string;
  };

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Sessions.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        patchId: {
          type: DataTypes.INTEGER,
          references: {
            model: Patches,
            key: 'id',
          },
        },
        sessionTypeId: {
          type: DataTypes.INTEGER,
          references: {
            model: SessionTypes,
            key: 'id',
          },
        },
        title: {
          type: DataTypes.STRING,
        },
        sessionMethod: {
          type: DataTypes.STRING,
        },
        meetingId: {
          type: DataTypes.STRING,
        },
        date: {
          type: DataTypes.DATE,
        },
        startTime: {
          type: DataTypes.TIME,
        },
        endTime: {
          type: DataTypes.TIME,
        },
        status: {
          type: DataTypes.ENUM,
          values: [
            'waiting',
            'expired',
            'running',
            'done',
            'cancelled',
            'absent',
            'rescheduled',
          ],
          defaultValue: 'waiting',
        },
        startedAt: {
          type: DataTypes.DATE,
        },
        joinedAt: {
          type: DataTypes.DATE,
        },
        endedAt: {
          type: DataTypes.DATE,
        },
        // New field for historical data
        history: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'sessions',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Patches);
    this.belongsTo(SessionTypes);
    this.hasMany(ZoomSessionMeetings);
    // Change to hasOne for 1-to-1 relationship
    this.hasOne(Reports, { foreignKey: 'sessionId' });
  }
}

export default Sessions;
