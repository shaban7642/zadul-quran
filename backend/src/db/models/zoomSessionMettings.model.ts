import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './users.model';
import Sessions from './sessions.model';

class ZoomSessionMeetings extends Model {
  public id!: number;

  public userId?: number;

  public sessionId?: number;

  public duration?: string;

  public meetingLink?: Date;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    ZoomSessionMeetings.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        sessionId: {
          type: DataTypes.INTEGER,
          references: {
            model: Sessions,
            key: 'id',
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        duration: {
          type: DataTypes.STRING,
        },
        meetingLink: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'zoomSessionMeetings',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User);
    this.belongsTo(Sessions);
  }
}

export default ZoomSessionMeetings;
