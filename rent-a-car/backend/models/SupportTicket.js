module.exports = (sequelize, DataTypes) => sequelize.define('SupportTicket', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  reservationId: { type: DataTypes.INTEGER, allowNull: true },
  guestName: { type: DataTypes.STRING(120), allowNull: true, field: 'guest_name' },
  guestEmail: { type: DataTypes.STRING(180), allowNull: true, field: 'guest_email', validate: { isEmail: true } },
  guestPhone: { type: DataTypes.STRING(30), allowNull: true, field: 'guest_phone' },
  origin: { type: DataTypes.ENUM('area_cliente', 'contacto_publico'), allowNull: false, defaultValue: 'area_cliente' },
  subject: { type: DataTypes.STRING(120), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('recebido', 'em_analise', 'resolvido'), allowNull: false, defaultValue: 'recebido' },
}, { tableName: 'support_tickets', timestamps: true });
