module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'Vehicle',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      plate: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
      },
      brand: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      model: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Compacto',
      },
      pricePerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price_per_day',
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Disponível',
      },
      imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'image_url',
      },
    },
    {
      tableName: 'vehicles',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  return Vehicle;
};