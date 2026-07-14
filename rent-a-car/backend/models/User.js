module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM('cliente', 'gestor', 'admin'),
        allowNull: false,
        defaultValue: 'cliente',
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      authVersion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'auth_version',
        validate: { min: 0 },
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
