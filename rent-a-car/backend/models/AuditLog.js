module.exports = (sequelize, DataTypes) => sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  actorId: { type: DataTypes.INTEGER, allowNull: true },
  actorEmail: { type: DataTypes.STRING(180), allowNull: true },
  actorRole: { type: DataTypes.STRING(30), allowNull: true },
  action: { type: DataTypes.STRING(40), allowNull: false },
  method: { type: DataTypes.STRING(10), allowNull: false },
  path: { type: DataTypes.STRING(300), allowNull: false },
  entityId: { type: DataTypes.STRING(80), allowNull: true },
  statusCode: { type: DataTypes.INTEGER, allowNull: false },
  ipAddress: { type: DataTypes.STRING(80), allowNull: true },
}, { tableName: 'audit_logs', timestamps: true, updatedAt: false });
