const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./User');
const VehicleModel = require('./Vehicle');
const MaintenanceAlertModel = require('./MaintenanceAlert');
const ReservationModel = require('./Reservation');
const UnavailabilityModel = require('./Unavailability');
const SupportTicketModel = require('./SupportTicket');
const ReviewModel = require('./Review');
const SupportMessageModel = require('./SupportMessage');
const NotificationModel = require('./Notification');
const AuditLogModel = require('./AuditLog');
const AppSettingModel = require('./AppSetting');

// Inicializa os models antes de definir as relacoes para evitar dependencias circulares.
const User = UserModel(sequelize, Sequelize.DataTypes);
const Vehicle = VehicleModel(sequelize, Sequelize.DataTypes);
const MaintenanceAlert = MaintenanceAlertModel(sequelize, Sequelize.DataTypes);
const Reservation = ReservationModel(sequelize, Sequelize.DataTypes);
const Unavailability = UnavailabilityModel(sequelize, Sequelize.DataTypes);
const SupportTicket = SupportTicketModel(sequelize, Sequelize.DataTypes);
const Review = ReviewModel(sequelize, Sequelize.DataTypes);
const SupportMessage = SupportMessageModel(sequelize, Sequelize.DataTypes);
const Notification = NotificationModel(sequelize, Sequelize.DataTypes);
const AuditLog = AuditLogModel(sequelize, Sequelize.DataTypes);
const AppSetting = AppSettingModel(sequelize, Sequelize.DataTypes);

Vehicle.hasMany(MaintenanceAlert, {
  foreignKey: 'vehicleId',
  as: 'alerts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

MaintenanceAlert.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

User.hasMany(Reservation, {
  foreignKey: 'userId',
  as: 'reservations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.hasMany(Reservation, {
  foreignKey: 'vehicleId',
  as: 'reservations',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.hasMany(Unavailability, {
  foreignKey: 'vehicleId',
  as: 'unavailabilities',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Reservation.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Reservation.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

Unavailability.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
});

User.hasMany(SupportTicket, { foreignKey: 'userId', as: 'supportTickets', onDelete: 'CASCADE' });
SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SupportTicket.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(User, { foreignKey: 'moderatedById', as: 'moderator' });
Review.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });
Reservation.hasOne(Review, { foreignKey: 'reservationId', as: 'review', onDelete: 'CASCADE' });
SupportTicket.hasMany(SupportMessage, { foreignKey: 'ticketId', as: 'messages', onDelete: 'CASCADE' });
SupportMessage.belongsTo(SupportTicket, { foreignKey: 'ticketId', as: 'ticket' });
SupportMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'actorId', as: 'auditLogs', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'actorId', as: 'actor' });
AppSetting.belongsTo(User, { foreignKey: 'updatedById', as: 'updatedBy' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Vehicle,
  MaintenanceAlert,
  Reservation,
  Unavailability,
  SupportTicket,
  Review,
  SupportMessage,
  Notification,
  AuditLog,
  AppSetting,
};
