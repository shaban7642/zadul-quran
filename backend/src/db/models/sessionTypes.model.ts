import { Sequelize, Model, DataTypes } from 'sequelize';
import Sessions from './sessions.model';

class SessionTypes extends Model {
  public id!: number;

  public name?: string;

  public duration?: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    SessionTypes.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        duration: {
          type: DataTypes.FLOAT,
        },
      },
      {
        sequelize,
        modelName: 'sessionTypes',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(Sessions);
  }
}

export default SessionTypes;
