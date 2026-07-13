module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      estado: {
        type: DataTypes.ENUM('pendente', 'confirmada', 'concluida', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendente',
      },
      preco_estimado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      extras: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      pickupLocation: {
        type: DataTypes.STRING(160),
        allowNull: true,
        field: 'pickup_location',
      },
    },
    {
      tableName: 'reservations',
      timestamps: true,
    }
  );

  return Reservation;
};
