import { Sequelize, Model, DataTypes } from 'sequelize';
import DocumentTypes from './documentTypes.model';
import User from './users.model';
import Reports from './reports.model';

class Documents extends Model {
  public id!: number;

  public documentTypeId?: number;

  public userId?: number;

  public reportId?: number;

  public fileName?: string;

  public fileType?: string;

  public fileStoragePath?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Documents.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        documentTypeId: {
          type: DataTypes.INTEGER,
          references: {
            model: DocumentTypes,
            key: 'id',
          },
        },
        reportId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'reports',
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
        fileName: {
          type: DataTypes.STRING,
        },
        fileType: {
          type: DataTypes.STRING,
        },
        fileStoragePath: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'documents',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User);
    this.belongsTo(DocumentTypes);

    // This association only applies if the document type is a report
    this.belongsTo(Reports, { foreignKey: 'reportId', constraints: false });
  }
}

export default Documents;
