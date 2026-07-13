module.exports = (sequelize, DataTypes) => sequelize.define('AppSetting', {
  key: { type: DataTypes.STRING(80), primaryKey: true },
  value: { type: DataTypes.JSONB, allowNull: false },
  updatedById: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'app_settings', timestamps: true });
