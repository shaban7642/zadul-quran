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
        book: {
          type: DataTypes.STRING,
        },
        unit: {
          type: DataTypes.STRING,
        },
        topic: {
          type: DataTypes.STRING,
        },
        level: {
          type: DataTypes.STRING,
        },
        notes: {
          type: DataTypes.TEXT,
        },
        homework: {
          type: DataTypes.TEXT,
        },
        newWords: {
          type: DataTypes.TEXT,
        },
        expressions: {
          type: DataTypes.TEXT,
        },
        rules: {
          type: DataTypes.TEXT,
        },
        memorization: {
          type: DataTypes.TEXT,
        },
        revision: {
          type: DataTypes.TEXT,
        },
        tajweed: {
          type: DataTypes.TEXT,
        },
        recitation: {
          type: DataTypes.TEXT,
        },
        reading: {
          type: DataTypes.TEXT,
        },
        memorizationLevel: {
          type: DataTypes.STRING,
        },
        revisionLevel: {
          type: DataTypes.STRING,
        },
        readingLevel: {
          type: DataTypes.STRING,
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
    this.belongsTo(Documents);
  }
}

export default Reports;
