import { Sequelize, Model, DataTypes } from 'sequelize';
import User from './users.model';
import Departments from './departments.model';

class Patches extends Model {
  public id!: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Patches.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        teacherId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        studentId: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: 'id',
          },
        },
        departmentId: {
          type: DataTypes.INTEGER,
          references: {
            model: Departments,
            key: 'id',
          },
        },
        fromDate: {
          type: DataTypes.DATE,
        },
        toDate: {
          type: DataTypes.DATE,
        },
        dayOfWeek: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'patches',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(User, { as: 'student' });
    this.belongsTo(User, { as: 'teacher' });
    this.belongsTo(Departments);
  }
}

export default Patches;
