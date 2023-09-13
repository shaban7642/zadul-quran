import { Sequelize, Model, DataTypes } from 'sequelize';
import Patches from './patches.model';

class Sessions extends Model {
  public id!: number;

  public patchId?: number;

  public sessionMethod?: string;

  public meetingId?: string;

  public date?: Date;

  public startTime?: Date;

  public endTime?: Date;

  public status?: string;

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
          values: ['waiting', 'expired', 'running', 'done', 'cancelled'],
          defaultValue: 'waiting',
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
  }
}

export default Sessions;
