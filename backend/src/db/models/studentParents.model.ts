import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './users.model';
import Parents from './parents.model';

class StudentParents extends Model {
  public id!: number;

  public userId?: number;

  public parentId?: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    StudentParents.init(
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
        parentId: {
          type: DataTypes.INTEGER,
          references: {
            model: Parents,
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'studentParents',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User);
    this.belongsTo(Parents);
  }
}

export default StudentParents;
