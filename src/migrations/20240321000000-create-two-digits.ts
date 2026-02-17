import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('two_digits', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Insert all 2-digit numbers (00-99)
  const digits = Array.from({ length: 100 }, (_, i) => ({
    two_digit: i.toString().padStart(2, '0'),
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert('two_digits', digits);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('two_digits');
} 