module.exports = (sequelize, DataTypes) => {
  const MaintenanceAlert = sequelize.define(
    'MaintenanceAlert',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'vehicle_id',
      },
      type: {
        type: DataTypes.ENUM('Manutenção', 'Indisponibilidade', 'Revisão', 'Sinistro'),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
      },
      unavailableUntil: {
        type: DataTypes.DATEONLY,
        field: 'unavailable_until',
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'maintenance_alerts',
      underscored: true,
      timestamps: true,
    }
  );

  MaintenanceAlert.associate = (models) => {
    MaintenanceAlert.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
  };

  return MaintenanceAlert;
};
