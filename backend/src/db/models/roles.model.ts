import { Sequelize, Model, DataTypes } from 'sequelize';

import Permissions from './permissions.model';
import RolePermissions from './rolePermissions.model';
import User from './users.model';

class Role extends Model {
  public id!: number;

  public name?: string;

  public displayName?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        displayName: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: 'roles',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.hasMany(User);
    this.belongsToMany(Permissions, {
      through: RolePermissions,
    });
  }
}

export default Role;
