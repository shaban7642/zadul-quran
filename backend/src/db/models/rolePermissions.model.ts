import { Sequelize, Model, DataTypes } from 'sequelize';
import Permissions from './permissions.model';
import Role from './roles.model';

class RolePermissions extends Model {
  public id!: number;

  public roleId?: number;

  public permissionId?: number;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    RolePermissions.init(
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
        permissionId: {
          type: DataTypes.INTEGER,
          references: {
            model: Permissions,
            key: 'id',
          },
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'rolePermissions',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsTo(Permissions);
    this.belongsTo(Role);
  }
}

export default RolePermissions;
