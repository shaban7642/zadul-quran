import { Sequelize, Model, DataTypes } from 'sequelize';
import Role from './roles.model';
import RolePermission from './rolePermissions.model';

class Permissions extends Model {
  public id!: number;

  public name?: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Permissions.init(
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
        modelName: 'permissions',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {
    this.belongsToMany(Role, {
      through: RolePermission,
    });
  }
}

export default Permissions;
