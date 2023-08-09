import { Sequelize, Model, DataTypes } from 'sequelize';

import Documents from './documents.model';

class DocumentTypes extends Model {
  public id!: number;

  public name?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    DocumentTypes.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'documentTypes',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(Documents);
  }
}

export default DocumentTypes;
