module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reference: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'vehicle_id',
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'end_date',
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price',
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Pendente',
      },
    },
    {
      tableName: 'bookings',
      underscored: true,
      timestamps: true,
    }
  );

  Booking.associate = (models) => {
    Booking.belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    Booking.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
  };

  return Booking;
};
