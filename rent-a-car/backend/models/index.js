const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./User');
const VehicleModel = require('./Vehicle');
const CustomerModel = require('./Customer');
const BookingModel = require('./Booking');
const MaintenanceAlertModel = require('./MaintenanceAlert');
const ReservationModel = require('./Reservation');
const UnavailabilityModel = require('./Unavailability');

// Inicializa os models antes de definir as relacoes para evitar dependencias circulares.
const User = UserModel(sequelize, Sequelize.DataTypes);
const Vehicle = VehicleModel(sequelize, Sequelize.DataTypes);
const Customer = CustomerModel(sequelize, Sequelize.DataTypes);
const Booking = BookingModel(sequelize, Sequelize.DataTypes);
const MaintenanceAlert = MaintenanceAlertModel(sequelize, Sequelize.DataTypes);
const Reservation = ReservationModel(sequelize, Sequelize.DataTypes);
const Unavailability = UnavailabilityModel(sequelize, Sequelize.DataTypes);

Vehicle.hasMany(Booking, {
  foreignKey: 'vehicleId',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Vehicle.hasMany(MaintenanceAlert, {
  foreignKey: 'vehicleId',
  as: 'alerts',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Customer.hasMany(Booking, {
  foreignKey: 'customerId',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Booking.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

Booking.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  as: 'vehicle',
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

module.exports = {
  sequelize,
  Sequelize,
  User,
  Vehicle,
  Customer,
  Booking,
  MaintenanceAlert,
  Reservation,
  Unavailability,
};