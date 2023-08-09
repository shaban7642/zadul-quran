import { Sequelize, Model, DataTypes } from 'sequelize';
import StudentParents from './studentParents.model';

class Parents extends Model {
  public id!: number;

  public name?: string;

  public relation?: string;

  public city?: string;

  public phoneNumber?: string;

  public email?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Parents.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        relation: {
          type: new DataTypes.STRING(),
        },
        city: {
          type: new DataTypes.STRING(),
        },
        phoneNumber: {
          type: new DataTypes.STRING(),
        },
        email: {
          type: new DataTypes.STRING(),
        },
      },
      {
        sequelize,
        modelName: 'parents',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(StudentParents);
  }
}

export default Parents;
