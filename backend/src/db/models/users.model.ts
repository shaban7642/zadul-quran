import { Sequelize, Model, DataTypes } from 'sequelize';
import { values as getValues } from 'lodash';

import enums from '../../../shared/enums';
import Role from './roles.model';
import UserAgents from './userAgents.model';
import StudentParents from './studentParents.model';
import Departments from './departments.model';

const { gender } = enums.User;

class User extends Model {
  public id!: number;

  public registrationNumber: string;

  public firstName: string;

  public lastName: string;

  public email: string;

  public phoneNumber: string;

  public registrationDate: string;

  public lastLoginDate: Date;

  public password: string;

  public gender: string;

  public birthDate: Date;

  public city: string;

  public isActive: boolean;

  public deActivateReason: string;

  public departmentId: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          references: {
            model: Role,
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
        registrationNumber: {
          type: DataTypes.STRING,
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        gender: {
          type: DataTypes.ENUM,
          values: getValues(gender),
        },
        birthDate: {
          type: DataTypes.DATE,
        },
        phoneNumber: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        username: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
        city: {
          type: DataTypes.STRING,
        },
        registrationDate: {
          type: DataTypes.DATE,
          defaultValue: new Date(),
        },
        lastLoginDate: {
          type: DataTypes.DATE,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
        },
        deActivateReason: {
          type: new DataTypes.STRING(255),
        },
      },
      {
        sequelize,
        modelName: 'users',
        indexes: [
          {
            unique: true,
            fields: ['id', 'userId'],
          },
        ],
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Role);
    this.belongsTo(Departments);
    this.hasMany(UserAgents);
    this.hasMany(StudentParents);
  }
}

export default User;
