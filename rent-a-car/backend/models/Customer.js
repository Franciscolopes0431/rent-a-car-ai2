module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
      },
    },
    {
      tableName: 'customers',
      underscored: true,
      timestamps: true,
    }
  );

  Customer.associate = (models) => {
    Customer.hasMany(models.Booking, { foreignKey: 'customerId', as: 'bookings' });
  };

  return Customer;
};
