import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './users.model';
import Sessions from './sessions.model';
import Documents from './documents.model';

class Reports extends Model {
  public id!: number;

  public documentId?: number;

  public userId?: number;

  public sessionId?: number;

  public date?: Date;

  public submissionDate?: Date;

  public reportContent?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Reports.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        documentId: {
          type: DataTypes.INTEGER,
          references: {
            model: Documents,
            key: 'id',
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        sessionId: {
          type: DataTypes.INTEGER,
          references: {
            model: Sessions,
            key: 'id',
          },
        },
        date: {
          type: DataTypes.DATE,
        },
        submissionDate: {
          type: DataTypes.DATE,
        },
        reportContent: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: 'reports',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User);
    this.belongsTo(Sessions);
    this.hasOne(Documents);
  }
}

export default Reports;
