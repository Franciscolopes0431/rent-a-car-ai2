module.exports = (sequelize, DataTypes) => sequelize.define('SupportMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ticketId: { type: DataTypes.INTEGER, allowNull: false },
  senderId: { type: DataTypes.INTEGER, allowNull: true },
  senderRole: { type: DataTypes.ENUM('cliente', 'gestor', 'admin', 'visitante', 'sistema'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false, validate: { len: [1, 2000] } },
}, { tableName: 'support_messages', timestamps: true });
