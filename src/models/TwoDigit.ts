import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface TwoDigitAttributes {
  id: number;
  two_digit: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class TwoDigit extends Model<TwoDigitAttributes> implements TwoDigitAttributes {
  public id!: number;
  public two_digit!: string;
  public status!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TwoDigit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    two_digit: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // 1 for active, 0 for inactive
    },
  },
  {
    sequelize,
    modelName: 'TwoDigit',
    tableName: 'two_digits',
  }
);

export default TwoDigit; 