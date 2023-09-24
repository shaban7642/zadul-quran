import { Sequelize, Model, DataTypes } from 'sequelize';
import Patches from './patches.model';

class Departments extends Model {
  public id!: number;

  public name?: string;

  public description?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Departments.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        description: {
          type: new DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: 'departments',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(Patches);
  }
}

export default Departments;
