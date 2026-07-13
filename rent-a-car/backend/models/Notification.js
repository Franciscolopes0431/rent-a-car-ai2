module.exports = (sequelize, DataTypes) => sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false },
  title: { type: DataTypes.STRING(140), allowNull: false },
  message: { type: DataTypes.STRING(500), allowNull: false },
  link: { type: DataTypes.STRING(240), allowNull: true },
  eventKey: { type: DataTypes.STRING(180), allowNull: true, unique: true },
  readAt: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'notifications', timestamps: true });
