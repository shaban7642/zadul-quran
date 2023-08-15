import { Sequelize, Model, DataTypes } from 'sequelize';

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
      },
      {
        sequelize,
        modelName: 'patches',
        paranoid: true,
      }
    );
  }

  public static initAssociation(): void {}
}

export default Patches;
