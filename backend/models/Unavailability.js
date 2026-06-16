module.exports = (sequelize, DataTypes) => {
  const Unavailability = sequelize.define(
    'Unavailability',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      data_fim: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      motivo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'unavailabilities',
      timestamps: true,
    }
  );

  return Unavailability;
};