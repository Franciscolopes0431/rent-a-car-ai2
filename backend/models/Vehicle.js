module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'Vehicle',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      matricula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      marca: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      preco_diario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      estado: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo',
      },
    },
    {
      tableName: 'vehicles',
      timestamps: true,
    }
  );

  return Vehicle;
};