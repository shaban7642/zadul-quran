import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './users.model';

class UserAgents extends Model {
  public id!: number;

  public userId?: number;

  public deviceName?: string;

  public deviceDescription?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    UserAgents.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        deviceName: {
          type: DataTypes.STRING,
        },
        deviceDescription: {
          type: new DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: 'userAgents',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User);
  }
}

export default UserAgents;
